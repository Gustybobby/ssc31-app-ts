import { dataTypes, type DataType, type FieldType, fieldTypes, typePermission, type GustybobbyOption } from "@/server/typeconfig/form"
import type { EventConfigProperty } from "../eventconfig"

export type ContentConfigProperty = {
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
}

export const contentPatterns = {
    label: /^[\u0E00-\u0E7F\w\s\?\(\)\,\.]{1,128}$/,
    placeholder: /^[\u0E00-\u0E7F\w\s\.\,\'\(\)\-]{0,64}$/,
    success: /^[\u0E00-\u0E7F\w\s\.\,\'\(\)\-]{0,64}$/,
    error: /^[\u0E00-\u0E7F\w\s\.\,\'\(\)\-]{0,64}$/,
    min_length: /^[0-9]{1,3}$/,
    max_length: /^[0-9]{1,3}$/,
    option_text: new RegExp(`^${dataTypes.STRING.pattern}{1,96}$`),
    option_num: new RegExp(`^${dataTypes.NUM.pattern}{1,96}$`)
}

export default class ContentConfig{
    id: ContentConfigProperty['id']
    label: ContentConfigProperty['label']
    field_type: ContentConfigProperty['field_type']
    data_type: ContentConfigProperty['data_type']
    min_length: ContentConfigProperty['min_length']
    max_length: ContentConfigProperty['max_length']
    options: ContentConfigProperty['options']
    placeholder: ContentConfigProperty['placeholder']
    success: ContentConfigProperty['success']
    error: ContentConfigProperty['error']
    default_value: ContentConfigProperty['default_value']
    required: ContentConfigProperty['required']

    constructor(contentConfig: ContentConfigProperty){
        this.id = contentConfig.id
        this.label = contentConfig.label
        this.data_type = contentConfig.data_type
        this.field_type = contentConfig.field_type
        this.min_length = contentConfig.min_length
        this.max_length = contentConfig.max_length
        this.options = contentConfig.options
        this.placeholder = contentConfig.placeholder
        this.success = contentConfig.success
        this.error = contentConfig.error
        this.default_value = contentConfig.default_value
        this.required = contentConfig.required
    }

    static getCompatibleFieldType(dataType: DataType, currentFieldType: FieldType): FieldType{
        if(dataTypes[dataType].force){
            return dataTypes[dataType].force ?? currentFieldType
        }
        else if(!fieldTypes[currentFieldType].allowed.includes(dataType)){
            for(const typeInfo of Object.values(fieldTypes)){
                if(typeInfo.allowed.includes(dataType)){
                    return typeInfo.id as FieldType
                }
            }
        }
        return currentFieldType
    }

    getOptionsByDataType(eventConfig: EventConfigProperty, filterOpen: boolean): GustybobbyOption[]{
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

    getOptions(){
        if(typePermission.fieldType.optionsLikeField.has(this.field_type) &&
        typePermission.dataType.allowCustomOptions.has(this.data_type)){
            return this.options
        }
        return []
    }

    getLabel(edit: boolean){
        return fieldTypes[this.field_type].fixed_label ?? (edit? '' : this.label)
    }

    getTrueLabel(){
        return fieldTypes[this.field_type].short_label ?? this.label
    }

    getRequired(){
        if(typePermission.fieldType.disableRequired.has(this.field_type)){
            return false
        }
        return this.required
    }

    validate(){
        if(!fieldTypes[this.field_type].allowed.includes(this.data_type)){
            throw `field type ${this.field_type} does not allow data type ${this.data_type}`
        }
        if(this.min_length > this.max_length){
            throw `min length cannot be more than max length`
        }
        if(!this.label.match(contentPatterns.label) && this.field_type !== 'INFO'){
            throw `label "${this.label}" is invalid`
        }
        if(!this.placeholder.match(contentPatterns.placeholder)){
            throw `placeholder "${this.placeholder}" is invalid`
        }
        if(!this.success.match(contentPatterns.success)){
            throw `success "${this.success}" is invalid`
        }
        if(!this.error.match(contentPatterns.error)){
            throw `error "${this.error}" is invalid`
        }
        let optionPattern: RegExp | null = null
        switch(this.data_type){
            case 'STRING':
                optionPattern = contentPatterns.option_text
                break
            case 'NUM':
                optionPattern = contentPatterns.option_num
                break
        }
        if(optionPattern){
            for(const option of this.options){
                if(!option.label.match(optionPattern)){
                    throw `option ${option.index} label "${option.label}" is invalid`
                }
            }
        }
    }
}