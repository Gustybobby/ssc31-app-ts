import { createCUID } from "@/cuid"
import type { ColumnFetches, TableView } from "@/server/typeconfig/event"
import type { GustybobbyOption } from "@/server/typeconfig/form"

interface ColumnFetchesEditor {
    group_id_view: string,
    form_id_view: string,
    groups: ColumnFetches
    fieldArray: GustybobbyOption[]
    viewTableArray: GustybobbyOption[]
}

interface ActionTypeSet {
    type: 'set',
    group_id: ColumnFetchesEditor['group_id_view'],
    column_fetches: ColumnFetchesEditor['groups']
    form_id: ColumnFetchesEditor['form_id_view'],
    fieldArray: ColumnFetchesEditor['fieldArray']
    viewTableArray: ColumnFetchesEditor['viewTableArray']
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

interface ActionTypeDeleteGroup {
    type: 'delete_group'
}

interface ActionTypeEditFields {
    type: 'edit_fields' | 'edit_table_view'
    fields: GustybobbyOption[]
}

type ColumnFetchesEditorReducerAction =
    ActionTypeSet |
    ActionTypeSetStatus |
    ActionTypeSetGroupView |
    ActionTypeAddGroup |
    ActionTypeDeleteGroup |
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
                viewTableArray: action.viewTableArray
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
                })),
                viewTableArray: state.viewTableArray.map((field) => ({
                    ...field,
                    active: !!state.groups?.[action.value].view_table?.includes(field.id as TableView)
                })),
            }
        case 'add_group':
            return {
                ...state,
                groups: {
                    ...state.groups,
                    [createCUID()]: {
                        name: action.name,
                        order: Object.keys(state.groups ?? {}).length,
                        view_table: [],
                        forms: {},
                    }
                }
            }
        case 'delete_group':
            const deletedGroups = { ...state.groups }
            delete deletedGroups[state.group_id_view]
            return {
                ...state,
                groups: deletedGroups,
                group_id_view: '',
            }
    }
    const group = state.groups?.[state.group_id_view]
    switch(action.type){
        case 'edit_fields':
            const selectedFieldId = action.fields.find((field) => field.active)?.id ?? 'none'
            let newGroups = { ...state.groups }
            if(selectedFieldId === 'none'){
                delete newGroups[state.group_id_view].forms[state.form_id_view]
            }
            return {
                ...state,
                fieldArray: action.fields,
                groups: selectedFieldId === 'none'? newGroups: {
                    ...state.groups,
                    [state.group_id_view]: {
                        name: group?.name ?? '',
                        order: group?.order ?? 0,
                        view_table: group?.view_table ?? [],
                        forms: {
                            ...group?.forms,
                            [state.form_id_view]: selectedFieldId 
                        }
                    }
                }
            }
        case 'edit_table_view':
            const activeTableViews = action.fields.filter(({ active }) => active).map(({ id }) => id)
            return {
                ...state,
                viewTableArray: action.fields,
                groups: {
                    ...state.groups,
                    [state.group_id_view]: {
                        name: group?.name ?? '',
                        order: group?.order ?? 0,
                        view_table: activeTableViews as TableView[],
                        forms: group?.forms ?? {}
                    }
                }
            }
    }
}