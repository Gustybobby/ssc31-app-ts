import { dataTypes, type DataType, type FieldType, type PrismaFieldConfig, fieldTypes, typePermission, type GustybobbyOption } from "@/server/typeconfig/form"
import type { FieldVisibilityProperty } from "./fieldvisibility"
import FieldVisibility from "./fieldvisibility"
import EventConfig from "../eventconfig"
import { getOptionStateFromSelection } from "../../inputfunction"

export type FieldConfigProperty = {
    id: string
    label: string
    field_type: FieldType
    data_type: DataType
    min_length: number
    max_length: number
    options: GustybobbyOption[]
    placeholder: string
    success: string
    error: string
    default_value: string
    required: boolean
    position_access: string[]
    role_access: string[]
    field_visibility?: FieldVisibilityProperty
    visible_conds: string
}

export default class FieldConfig{
    id: string
    label: string
    field_type: FieldType
    data_type: DataType
    min_length: number
    max_length: number
    options: GustybobbyOption[]
    placeholder: string
    success: string
    error: string
    default_value: string
    required: boolean
    position_access: string[]
    role_access: string[]
    field_visibility?: FieldVisibilityProperty
    visible_conds: string

    constructor(fieldConfig: FieldConfigProperty){
        this.id = fieldConfig.id
        this.label = fieldConfig.label
        this.data_type = fieldConfig.data_type
        this.field_type = fieldConfig.field_type
        this.min_length = fieldConfig.min_length
        this.max_length = fieldConfig.max_length
        this.options = fieldConfig.options
        this.placeholder = fieldConfig.placeholder
        this.success = fieldConfig.success
        this.error = fieldConfig.error
        this.default_value = fieldConfig.default_value
        this.required = fieldConfig.required
        this.position_access = fieldConfig.position_access
        this.role_access = fieldConfig.role_access
        this.field_visibility = fieldConfig.field_visibility
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
            visible_conds: ''
        })
    }

    static fromDatabase(prismaField: PrismaFieldConfig){
        return new FieldConfig({
            ...prismaField,
            options: prismaField.options.map((label, index) => ({
                id: `${prismaField.id}_OPTION_${index}`,
                label,
                index,
                active: false,
            })),
        })
    }

    static clone(fieldConfig: FieldConfig){
        return new FieldConfig({
            ...fieldConfig,
            options: fieldConfig.options.map((option) => ({ ...option })),
            position_access: [...fieldConfig.position_access],
            role_access: [...fieldConfig.role_access],
            field_visibility: {...FieldVisibility.clone(new FieldVisibility(fieldConfig.field_visibility))}
        })
    }

    static getCompatibleFieldType(dataType: DataType, currentFieldType: FieldType){
        if(dataTypes[dataType].force !== null){
            return dataTypes[dataType].force
        }
        else if(!fieldTypes[currentFieldType].allowed.includes(dataType)){
            for(const typeInfo of Object.values(fieldTypes)){
                if(typeInfo.allowed.includes(dataType)){
                    return typeInfo.id
                }
            }
        }
        return currentFieldType
    }

    validate(){
        if(!fieldTypes[this.field_type].allowed.includes(this.data_type)){
            throw `field type ${this.field_type} does not allow data type ${this.data_type}`
        }
        if(this.min_length > this.max_length){
            throw `min length cannot be more than max length`
        }
        FieldVisibility.validateString(this.visible_conds)
        return true
    }

    dataIsValid(dataString: string, eventConfig: EventConfig){
        if(this.field_type === 'INFO'){
            return !dataString
        }
        if(dataTypes[this.data_type].specialValid){
            return !!dataTypes[this.data_type].specialValid?.(dataString)
        }
        if(typePermission.fieldType.optionsLikeField.has(this.field_type)){
            if(dataString === '' && this.required && !this.visible_conds){
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

    getOptionsByDataType(eventConfig: EventConfig, filterOpen: boolean): GustybobbyOption[]{
        if(dataTypes[this.data_type].options){
            return dataTypes[this.data_type].options?.({...eventConfig})
                .filter((option) => !filterOpen || option.open)
                .map((option,index) => {
                    return {
                        id: option.id ?? '',
                        label: option.label ?? '',
                        index,
                        active: false,
                    }
                }) ?? []
        }
        return this.options
    }

    getFieldId(){
        return [this.id, fieldTypes[this.field_type].user_field_tail].join('_')
    }

    getPattern(){
        if(typePermission.fieldType.optionsLikeField.has(this.field_type)){
            return ''
        }
        return `^${dataTypes[this.data_type].pattern}{${this.min_length},${Math.max(this.min_length,this.max_length)}}$`
    }

    getError(){
        if(typePermission.fieldType.optionsLikeField.has(this.field_type)){
            return ''
        }
        return [dataTypes[this.data_type].error,`${this.min_length} - ${this.max_length} chars.`].join(', ')
    }

    getLabel(edit: boolean){
        return fieldTypes[this.field_type].fixed_label || (edit? '' : (this.label || 'Untitled Field'))
    }

    getValidDataTypeOptions(){
        return Object.values(dataTypes).map((config) => ({
            ...config,
            active: config.id === this.data_type
        }))
    }

    getValidFieldTypeOptions(){
        return Object.values(fieldTypes).map((config) => ({
            ...config,
            active: config.id === this.field_type
        })).filter((config)=>config.allowed.includes(this.data_type))
    }

    getPackedRequest(){
        return {
            id: this.id,
            data_type: this.data_type,
            field_type: this.field_type,
            required: this.required,
            label: this.label,
            placeholder: this.placeholder,
            min_length: this.min_length,
            max_length: this.max_length,
            success: this.success,
            error: this.error,
            default_value: this.default_value,
            options: this.options.map((option) => option.label),
            position_access: this.position_access,
            role_access: this.role_access,
            visible_conds: this.visible_conds,
        }
    }
}