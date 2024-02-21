import { dataTypes, type PrismaFieldConfig, fieldTypes, typePermission, type GustybobbyOption } from "@/server/typeconfig/form"
import FieldVisibility from "./fieldvisibility"
import EventConfig from "../eventconfig"
import { getOptionStateFromSelection } from "../../inputfunction"
import ContentConfig, { type ContentConfigProperty } from "./contentconfig"

export interface FieldConfigProperty extends ContentConfigProperty {
    position_access: string[]
    role_access: string[]
    visible_conds: string
}

export default class FieldConfig extends ContentConfig{
    position_access: FieldConfigProperty['position_access']
    role_access: FieldConfigProperty['role_access']
    visible_conds: FieldConfigProperty['visible_conds']

    constructor(fieldConfig: FieldConfigProperty){
        super(fieldConfig)
        this.position_access = fieldConfig.position_access
        this.role_access = fieldConfig.role_access
        this.visible_conds = fieldConfig.visible_conds
    }

    static defaultField(field_id: string){
        return new FieldConfig({
            id: field_id,
            label: 'Untitled Field',
            field_type: 'SHORTANS',
            data_type: 'STRING',
            min_length: 0,
            max_length: 64,
            options: [],
            placeholder: '',
            success: 'Field is valid',
            error: 'ก-ฮ,A-Z,a-z,0-9.,max 64 chars.',
            default_value: '',
            required: false,
            position_access: [],
            role_access: [],
            visible_conds: 'NONE'
        })
    }

    static fromDatabase(prismaField: PrismaFieldConfig){
        return new FieldConfig({ ...prismaField })
    }

    static clone(fieldConfig: FieldConfig){
        return new FieldConfig({
            ...fieldConfig,
            options: fieldConfig.options.map((option) => ({ ...option })),
            position_access: [...fieldConfig.position_access],
            role_access: [...fieldConfig.role_access],
        })
    }

    validate(){
        super.validate()
        FieldVisibility.validateString(this.visible_conds)
    }

    dataIsValid(dataString: string, eventConfig: EventConfig){
        if(this.field_type === 'INFO'){
            return dataString === ''
        }
        if(dataString === ''){
            return this.required? (this.visible_conds !== '') : true
        }
        if(dataTypes[this.data_type].specialValid){
            return !!dataTypes[this.data_type].specialValid?.(dataString, this)
        }
        if(typePermission.fieldType.optionsLikeField.has(this.field_type)){
            if(this.field_type === 'PRIVACYPOLICY' && !dataString.startsWith('true')){
                return false
            }
            const fieldOptions = this.getOptionsByDataType(eventConfig, true)
            const selectionState = getOptionStateFromSelection(dataString)
            for(const id of Object.keys(selectionState)){
                if(!fieldOptions.find((option) => option.id === id)){
                    return false
                }
            }
        }
        return !!dataString.match(new RegExp(this.getPattern()))
    }

    getValidDataTypeOptions(): GustybobbyOption[]{
        return Object.values(dataTypes).map((config,index) => ({
            id: config.id,
            label: config.label,
            index,
            active: config.id === this.data_type
        }))
    }

    getValidFieldTypeOptions(): GustybobbyOption[]{
        return Object.values(fieldTypes)
            .filter((config)=>config.allowed.includes(this.data_type))
            .map((config, index) => ({
                id: config.id,
                label: config.label,
                index,
                active: config.id === this.field_type
        }))
    }
}