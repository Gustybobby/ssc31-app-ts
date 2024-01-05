import { createCUID } from "@/cuid"
import type { EventConfigProperty } from "@/server/classes/eventconfig"
import type { FieldConfigProperty } from "@/server/classes/forms/fieldconfig"
import FieldConfig from "@/server/classes/forms/fieldconfig"
import type { FieldVisibilityProperty } from "@/server/classes/forms/fieldvisibility"
import FieldVisibility from "@/server/classes/forms/fieldvisibility"
import type { FormConfigProperty } from "@/server/classes/forms/formconfig"
import { type GustybobbyOption, formTypes, type DataType } from "@/server/typeconfig/form"
import type { FormType, ResponseType } from "@prisma/client"

export interface EditorFieldConfigProperty extends FieldConfigProperty {
    allPreviousOptions: GustybobbyOption[]
}

export interface EditorFormConfig extends FormConfigProperty {
    eventConfig: EventConfigProperty | 'loading'
    form_fields?: {
        [key: string]: EditorFieldConfigProperty
    }
}

interface ActionTypeSetConfig {
    type: 'set_config'
    eventConfig: EventConfigProperty
    config: FormConfigProperty
}

interface ActionTypeSetTemplate {
    type: 'set_template'
    eventConfig: EventConfigProperty
    template: {
        field_order: string[]
        form_fields: {
            [key: string]: FieldConfigProperty
        },
    }
}

interface ActionTypeSetEventConfig {
    type: 'set_event_config'
    eventConfig: EventConfigProperty
}

interface ActionTypeEditString {
    type: 'edit_string'
    key: 'title' | 'description' | 'submitted_area'
    value: string
}

interface ActionTypeEditBoolean {
    type: 'edit_boolean'
    key: 'open' | 'public'
    value: boolean
}

interface ActionTypeEditType {
    type: 'edit_type'
    value: FormType
}

interface ActionTypeEditResponseType {
    type: 'edit_response_type'
    value: ResponseType
}

interface ActionTypeEditAccess {
    type: 'edit_access'
    key: 'global_position_access' | 'global_role_access' | 'position_restricts' | 'role_restricts'
    value: { id: string }[]
}

interface ActionTypeEmailRestricts {
    type: 'edit_email_restricts'
    value: string[]
}

interface ActionTypeNewField {
    type: 'new_field'
}

interface ActionTypeSwapFields {
    type: 'swap_fields'
    index: number
    direction: 1 | -1
}

interface ActionTypeDeleteField {
    type: 'delete_field'
    field_id: string
}

interface ActionTypeEditFieldString {
    type: 'edit_field_string'
    field_id: string
    key: 'label' | 'placeholder' | 'success' | 'error'
    value: string
}

interface ActionTypeEditFieldNumber {
    type: 'edit_field_number'
    field_id: string
    key: 'min_length' | 'max_length'
    value: number
}

interface ActionTypeEditFieldBoolean {
    type: 'edit_field_boolean'
    field_id: string
    key: 'required'
    value: boolean
}

interface ActionTypeEditFieldAccess {
    type: 'edit_field_access'
    field_id: string
    key: 'position_access' | 'role_access'
    value: string[]
}

interface ActionTypeEditDataType {
    type: 'edit_data_type'
    field_id: string
    value: FieldConfigProperty['data_type']
}

interface ActionTypeEditFieldType {
    type: 'edit_field_type'
    field_id: string
    value: FieldConfigProperty['field_type']
}

interface ActionTypeEditFieldOptionLabel {
    type: 'edit_field_option_label'
    field_id: string
    option_index: number
    value: string
}

interface ActionTypeEditFieldNewOption {
    type: 'edit_field_new_option'
    field_id: string
}

interface ActionTypeEditFieldDeleteOption {
    type: 'edit_field_delete_option'
    field_id: string
    option_id: string
}

interface ActionTypeEditFieldBoolCode {
    type: 'edit_field_bool_code'
    field_id: string
    code: FieldVisibilityProperty['boolCode']
}

interface ActionTypeEditFieldTriggers {
    type: 'edit_field_triggers'
    field_id: string
    options: GustybobbyOption[]
}

export type FormConfigReducerActionType = 
    ActionTypeSetConfig |
    ActionTypeSetTemplate |
    ActionTypeSetEventConfig |
    ActionTypeEditString |
    ActionTypeEditBoolean |
    ActionTypeEditType |
    ActionTypeEditResponseType |
    ActionTypeEditAccess |
    ActionTypeEmailRestricts |
    ActionTypeNewField |
    ActionTypeSwapFields |
    ActionTypeDeleteField |
    ActionTypeEditFieldString |
    ActionTypeEditFieldNumber |
    ActionTypeEditFieldBoolean |
    ActionTypeEditFieldAccess |
    ActionTypeEditDataType |
    ActionTypeEditFieldType |
    ActionTypeEditFieldOptionLabel |
    ActionTypeEditFieldNewOption |
    ActionTypeEditFieldDeleteOption |
    ActionTypeEditFieldBoolCode |
    ActionTypeEditFieldTriggers

export default function formConfigReducer(state: EditorFormConfig, action: FormConfigReducerActionType): EditorFormConfig{
    switch(action.type){
        case 'edit_string':
        case 'edit_boolean':
        case 'edit_access':
            return {
                ...state,
                [action.key]: action.value
            }
        case 'edit_type':
            return {
                ...state,
                type: action.value,
                ...formTypes[action.value].force
            }
        case 'edit_response_type':
            return {
                ...state,
                response_type: action.value
            }
        case 'edit_email_restricts':
            return {
                ...state,
                email_restricts: action.value
            }
    }
    if(!state.field_order || !state.form_fields){
        throw 'state field order or form fields is undefined'
    }
    switch(action.type){
        case 'edit_field_string':
        case 'edit_field_number':
        case 'edit_field_boolean':
        case 'edit_field_access':
            return {
                ...state,
                form_fields: {
                    ...state.form_fields,
                    [action.field_id]: {
                        ...state.form_fields[action.field_id],
                        [action.key]: action.value,
                    }
                }
            }
        case 'edit_data_type':
            const dataTypeAssertConfig = new FieldConfig({
                ...state.form_fields[action.field_id],
                data_type: action.value,
                field_type: FieldConfig.getCompatibleFieldType(action.value, state.form_fields[action.field_id].field_type)
            })
            return {
                ...state,
                form_fields: {
                    ...state.form_fields,
                    [action.field_id]: {
                        ...state.form_fields[action.field_id],
                        data_type: action.value,
                        field_type: dataTypeAssertConfig.field_type,
                        error: dataTypeAssertConfig.getError(),
                        required: dataTypeAssertConfig.getRequired(),
                    }
                }
            }
        case 'edit_field_type':
            const fieldTypeAssertConfig = new FieldConfig({
                ...state.form_fields[action.field_id],
                field_type: action.value
            })
            return {
                ...state,
                form_fields: {
                    ...state.form_fields,
                    [action.field_id]: {
                        ...state.form_fields[action.field_id],
                        field_type: action.value,
                        label: fieldTypeAssertConfig.getTrueLabel(),
                        error: fieldTypeAssertConfig.getError(),
                        required: fieldTypeAssertConfig.getRequired(),
                        options: fieldTypeAssertConfig.getOptions(),
                    }
                }
            }
    }
    let fieldVisibility: FieldVisibility
    switch(action.type){
        case 'edit_field_bool_code':
            fieldVisibility = FieldVisibility.fromString(state.form_fields[action.field_id].visible_conds)
            fieldVisibility.boolCode = action.code
            return {
                ...state,
                form_fields: {
                    ...state.form_fields,
                    [action.field_id]: {
                        ...state.form_fields[action.field_id],
                        visible_conds: fieldVisibility.stringify()
                    }
                }
            }
        case 'edit_field_triggers':
            fieldVisibility = FieldVisibility.fromString(state.form_fields[action.field_id].visible_conds)
            fieldVisibility.setTriggersFromGustybobbies(action.options)
            return {
                ...state,
                form_fields: {
                    ...state.form_fields,
                    [action.field_id]: {
                        ...state.form_fields[action.field_id],
                        visible_conds: fieldVisibility.stringify()
                    }
                }
            }
    }
    switch(action.type){
        case 'set_event_config':
            return {
                ...state,
                eventConfig: action.eventConfig,
                form_fields: getPrevOptionsMappedFields({
                    form: { field_order: state.field_order, form_fields: state.form_fields },
                    eventConfig: action.eventConfig
                })
            }
        case 'set_config':
            if(!action.config.field_order || !action.config.form_fields){
                throw 'config field order or form fields is undefined'
            }
            return {
                ...action.config,
                eventConfig: action.eventConfig,
                form_fields: getPrevOptionsMappedFields({
                    form: { field_order: action.config.field_order, form_fields: action.config.form_fields },
                    eventConfig: action.eventConfig
                })
            }
        case 'set_template':
            return {
                ...state,
                eventConfig: action.eventConfig,
                field_order: action.template.field_order,
                form_fields: getPrevOptionsMappedFields({
                    form: { field_order: action.template.field_order, form_fields: action.template.form_fields },
                    eventConfig: action.eventConfig
                })
            }
    }
    if(state.eventConfig === 'loading'){
        return { ...state }
    }
    switch(action.type){
        case 'new_field':
            const newFieldId = createCUID()
            const createFieldOrder = state.field_order.concat(newFieldId)
            const createFormFields = { ...state.form_fields, [newFieldId]: { ...FieldConfig.defaultField(newFieldId) } }
            return {
                ...state,
                field_order: createFieldOrder,
                form_fields: getPrevOptionsMappedFields({
                    form: { field_order: createFieldOrder, form_fields: createFormFields },
                    eventConfig: state.eventConfig
                })
            }
        case 'swap_fields':
            const newFieldOrder = [...state.field_order]
            const swapIndex = action.index + action.direction
            if(swapIndex >= state.field_order.length || swapIndex < 0){
                return { ...state }
            }
            const temp = newFieldOrder[action.index]
            newFieldOrder[action.index] = newFieldOrder[swapIndex]
            newFieldOrder[swapIndex] = temp 
            return {
                ...state,
                field_order: newFieldOrder,
                form_fields: getPrevOptionsMappedFields({
                    form: { field_order: newFieldOrder, form_fields: state.form_fields },
                    eventConfig: state.eventConfig
                }),
            }
        case 'delete_field':
            const formFieldsAfterDelete = { ...state.form_fields }
            delete formFieldsAfterDelete[action.field_id]
            const orderAfterDelete = state.field_order.filter((id) => id !== action.field_id)
            return {
                ...state,
                field_order: orderAfterDelete,
                form_fields: getPrevOptionsMappedFields({
                    form: { field_order: orderAfterDelete, form_fields: formFieldsAfterDelete },
                    eventConfig: state.eventConfig
                }),
            }
        case 'edit_field_option_label':
            const editedOptions = state.form_fields[action.field_id].options.map((option) => {
                if(option.index === action.option_index){
                    return { ...option, label: action.value }
                }
                return { ...option }
            })
            const formFieldsAfterLabelEdit = {
                ...state.form_fields,
                [action.field_id]: {
                    ...state.form_fields[action.field_id],
                    options: editedOptions,
                }
            }
            return {
                ...state,
                form_fields: getPrevOptionsMappedFields({
                    form: { field_order: state.field_order, form_fields: formFieldsAfterLabelEdit },
                    eventConfig: state.eventConfig
                })
            }
        case 'edit_field_new_option':
            const newOptions = state.form_fields[action.field_id].options.map((option, index) => ({ ...option, index }))
            const newOptionId = createCUID()
            const formFieldsAfterNewOption = {
                ...state.form_fields,
                [action.field_id]: {
                    ...state.form_fields[action.field_id],
                    options: newOptions.concat({
                        id: `${action.field_id}_OPTION_${newOptionId}`,
                        label: 'Untitled option',
                        index: newOptions.length,
                        active: false,
                    }),
                }
            }
            return {
                ...state,
                form_fields: getPrevOptionsMappedFields({
                    form: { field_order: state.field_order, form_fields: formFieldsAfterNewOption },
                    eventConfig: state.eventConfig
                })
            }
        case 'edit_field_delete_option':
            const deletedOptions = state.form_fields[action.field_id].options.filter((option) => option.id !== action.option_id)
            const formFieldsAfterDeleteOption = {
                ...state.form_fields,
                [action.field_id]: {
                    ...state.form_fields[action.field_id],
                    options: deletedOptions,
                }
            }
            return {
                ...state,
                form_fields: getPrevOptionsMappedFields({
                    form: { field_order: state.field_order, form_fields: formFieldsAfterDeleteOption },
                    eventConfig: state.eventConfig
                })
            }
    }
}

interface PrevOptionsMapProps {
    form: { field_order: string[], form_fields: FormConfigProperty['form_fields'] }
    eventConfig: EventConfigProperty
}

interface PrevOptionsProps extends PrevOptionsMapProps{
    fieldConfig: { id: string, data_type: DataType, options: GustybobbyOption[] }
}

function getPrevOptionsMappedFields(props: PrevOptionsMapProps): EditorFormConfig['form_fields']{
    if(!props.form.form_fields){
        throw 'invalid form fields'
    }
    const allOptions = getAllOptions(props)
    return Object.fromEntries(
        Object.entries(props.form.form_fields).map(([id, field]) => {
            return [id, {
                ...field,
                allPreviousOptions: getPrevOptions({
                    ...props,
                    fieldConfig: {
                        id: field.id,
                        data_type: field.data_type,
                        options: field.options,
                    }
                }, allOptions)
            }]
    }))
}

function getPrevOptions(props: PrevOptionsProps, allOptions: GustybobbyOption[]){
    const fieldOrder = props.form.field_order
    const targetFieldIndex = fieldOrder.findIndex((id) => id === props.fieldConfig.id)
    if(targetFieldIndex === -1){
        throw 'invalid field id'
    }
    const prevOptions: GustybobbyOption[] = []
    var i = 0, j = 0
    while(i<targetFieldIndex){
        while(allOptions[j]?.id?.startsWith(fieldOrder[i])){
            prevOptions.push(allOptions[j])
            j++
        }
        i++
    }
    return prevOptions
}

function getAllOptions(props: PrevOptionsMapProps){
    let allOptions: GustybobbyOption[] = []
    props.form.field_order.forEach((id, index) => {
        if(!props.form.form_fields?.[id]?.data_type){
            throw 'invalid field config'
        }
        const fieldConfig = new FieldConfig({
            ...FieldConfig.defaultField(id),
            data_type: props.form.form_fields[id].data_type,
            options: props.form.form_fields[id].options,
        })
        const fieldOptions = fieldConfig.getOptionsByDataType(props.eventConfig, true).map((option) => ({
            ...option,
            id: `${fieldConfig.id}_OPTION_${option.index}`,
            label: `Field ${index+1}: ${option.index+1}. ${option.label}`
        }))
        allOptions = allOptions.concat(fieldOptions)
    })
    return allOptions
}