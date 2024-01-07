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

interface ActionTypeNextPage {
    type: 'next_page'
}

interface ActionTypePrevPage {
    type: 'prev_page'
}

interface ActionTypeSetSubmitted {
    type: 'set_submitted'
}

export type EventFormReducerAction =
    ActionTypeEditResponses |
    ActionTypeNextPage |
    ActionTypePrevPage |
    ActionTypeSetSubmitted

export default function eventFormReducer(state: EventForm, action: EventFormReducerAction): EventForm {
    switch(action.type){
        case 'edit_responses':
            const pagedFields = state.pagedFields.map((fields) => fields.map((field => ({
                ...field,
                default_value: action.responses[field.id] ?? field.default_value
            }))))
            return { ...state, pagedFields, responses: { ...state.responses, ...action.responses } }
        case 'next_page':
        case 'prev_page':
            let page = state.page
            let newPageFields: FieldConfigProperty[] = []
            let finished = false
            while(newPageFields.length === 0){
                page += (action.type === 'next_page'? 1 : -1)
                if(page < 0){
                    throw 'page number cannot be negative'
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