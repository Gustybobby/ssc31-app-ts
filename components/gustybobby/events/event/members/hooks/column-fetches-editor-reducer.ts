import { createCUID } from "@/cuid"
import type { ColumnFetches } from "@/server/typeconfig/event"
import type { GustybobbyOption } from "@/server/typeconfig/form"

interface ColumnFetchesEditor {
    group_id_view: string,
    form_id_view: string,
    groups: ColumnFetches
    fieldArray: GustybobbyOption[]
}

interface ActionTypeSet {
    type: 'set',
    group_id: ColumnFetchesEditor['group_id_view'],
    column_fetches: ColumnFetchesEditor['groups']
    form_id: ColumnFetchesEditor['form_id_view'],
    fieldArray: ColumnFetchesEditor['fieldArray']
}

interface ActionTypeSetStatus {
    type: 'set_status'
    status: 'error' | 'loading'
}

interface ActionTypeSetGroupView {
    type: 'set_group_view'
    value: string
}

interface ActionTypeAddGroup {
    type: 'add_group'
    name: string
}

interface ActionTypeEditFields {
    type: 'edit_fields'
    fields: GustybobbyOption[]
}

type ColumnFetchesEditorReducerAction =
    ActionTypeSet |
    ActionTypeSetStatus |
    ActionTypeSetGroupView |
    ActionTypeAddGroup |
    ActionTypeEditFields

export type ColumnFetchesEditorState = ColumnFetchesEditor | 'loading' | 'error'

export default function columnFetchesEditorReducer(state: ColumnFetchesEditorState, action: ColumnFetchesEditorReducerAction): ColumnFetchesEditorState {
    switch(action.type){
        case 'set':
            return {
                group_id_view: action.group_id,
                groups: action.column_fetches,
                form_id_view: action.form_id,
                fieldArray: action.fieldArray,
            }
        case 'set_status':
            return action.status
    }
    if(state === 'loading' || state === 'error'){
        throw 'state is loading or error'
    }
    switch(action.type){
        case 'set_group_view':
            return {
                ...state,
                group_id_view: action.value,
                fieldArray: state.fieldArray.map((field) => ({
                    ...field,
                    active: field.id === (state.groups?.[action.value].forms[state.form_id_view] ?? 'none')
                }))
            }
        case 'add_group':
            return {
                ...state,
                groups: {
                    ...state.groups,
                    [createCUID()]: {
                        name: action.name,
                        order: Object.keys(state.groups ?? {}).length,
                        forms: {},
                    }
                }
            }
        case 'edit_fields':
            const selectedFieldId = action.fields.find((field) => field.active)?.id ?? 'none'
            return {
                ...state,
                fieldArray: action.fields,
                groups: selectedFieldId === 'none'? { ...state.groups }: {
                    ...state.groups,
                    [state.group_id_view]: {
                        name: state.groups?.[state.group_id_view].name ?? '',
                        order: state.groups?.[state.group_id_view].order ?? 0,
                        forms: {
                            ...state.groups?.[state.group_id_view].forms,
                            [state.form_id_view]: selectedFieldId 
                        }
                    }
                }
            }
    }
}