import type { FieldConfigProperty } from "@/server/classes/forms/fieldconfig";
import type { FormPaginationProperty } from "@/server/classes/forms/formpagination";
import FormPagination from "@/server/classes/forms/formpagination";

export interface EventForm extends FormPaginationProperty {
    form_id: string,
    currentPageFields: FieldConfigProperty[]
    finished: boolean
    submitted: boolean
}

interface ActionTypeEditResponses {
    type: 'edit_responses'
    responses: FormPaginationProperty['responses']
}

interface ActionTypeSetPage {
    type: 'set_page'
    page: number
}

interface ActionTypeSetSubmitted {
    type: 'set_submitted'
}

export type EventFormReducerAction =
    ActionTypeEditResponses |
    ActionTypeSetPage |
    ActionTypeSetSubmitted

export default function eventFormReducer(state: EventForm, action: EventFormReducerAction): EventForm {
    switch(action.type){
        case 'edit_responses':
            const pagedFields = state.pagedFields.map((fields) => fields.map((field => ({
                ...field,
                default_value: action.responses[field.id] ?? field.default_value
            }))))
            return { ...state, pagedFields, responses: { ...state.responses, ...action.responses } }
        case 'set_page':
            const page = action.page
            let newPageFields: FieldConfigProperty[] = []
            let finished = false
            while(newPageFields.length === 0){
                if(page < 0){
                    return { ...state }
                }
                if(page >= state.pagedFields.length){
                    finished = true
                    break
                }
                newPageFields = (new FormPagination({ ...state, page })).getCurrentPageFields()
            }
            return { ...state, page, finished, currentPageFields: newPageFields }
        case 'set_submitted':
            return { ...state, submitted: true }
    }
}