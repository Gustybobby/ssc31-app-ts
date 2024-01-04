import { createCUID } from "@/cuid"
import type { EventFormTemplate } from "@prisma/client"
import type { FieldConfigProperty } from "./fieldconfig"

export default class FormTemplate{
    label
    placeholder
    success
    error
    default_value
    min_length
    max_length
    required
    data_type
    field_type
    options
    constructor(template?: EventFormTemplate){
        this.label = template?.label ?? []
        this.placeholder = template?.placeholder ?? []
        this.success = template?.success ?? []
        this.error = template?.error ?? []
        this.default_value = template?.default_value ?? []
        this.min_length = template?.min_length ?? []
        this.max_length = template?.max_length ?? []
        this.required = template?.required ?? []
        this.data_type = template?.data_type ?? []
        this.field_type = template?.field_type ?? []
        this.options = template?.options ?? []
    }

    static fromFormFieldsArray(formfieldsArray: FieldConfigProperty[]){
        const formTemplate = new FormTemplate()
        const options = (field: FieldConfigProperty) => {
            switch(field.data_type){
                case 'POSITION':
                case 'ROLE':
                case 'BOOLEAN':
                    return ""
                default:
                    return field.options.map((option) => option.label).join('|')
            }
        }
        for(const field of formfieldsArray){
            formTemplate.label.push(field.label)
            formTemplate.placeholder.push(field.placeholder)
            formTemplate.success.push(field.success)
            formTemplate.error.push(field.error)
            formTemplate.default_value.push(field.default_value)
            formTemplate.min_length.push(Number(field.min_length))
            formTemplate.max_length.push(Number(field.max_length))
            formTemplate.required.push(field.required)
            formTemplate.data_type.push(field.data_type)
            formTemplate.field_type.push(field.field_type)
            formTemplate.options.push(options(field))
        }
        return formTemplate
    }

    getFormFieldsAndOrder(){
        const form_fields: { [key: string]: FieldConfigProperty } = {}
        const field_order = []
        for(var i=0;i<this.label.length;i++){
            const cuid = createCUID()
            field_order.push(cuid)
            form_fields[cuid] = {
                id: cuid,
                label: this.label[i],
                field_type: this.field_type[i],
                data_type: this.data_type[i],
                min_length: this.min_length[i],
                max_length: this.max_length[i],
                placeholder: this.placeholder[i],
                default_value: this.default_value[i],
                success: this.success[i],
                error: this.error[i],
                options: (this.options[i] != "")? this.options[i].split('|').map((option,index) => ({ 
                            id: `${cuid}_OPTION_${index}`,
                            label: option,
                            index: index,
                            active: false,
                        })) : [],
                required: this.required[i],
                position_access: [],
                role_access: [],
                visible_conds: '',
            }
        }
        return { form_fields, field_order }
    }
}