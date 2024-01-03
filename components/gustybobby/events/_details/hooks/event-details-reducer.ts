import type { EventDataRequest } from "@/server/typeconfig/event"
import type { Dispatch } from "react"

export interface DispatchEventDetails {
    dispatchEventDetails: Dispatch<EventDetailsReducerAction>
}

export interface EventDetailsHookProps extends DispatchEventDetails {
    eventDetails: EventDataRequest
}

type EventDetailsReducerAction = (
    ActionTypeSet |
    ActionTypeEditSingle |
    ActionTypeEditPositionLabel |
    ActionTypeEditPositionBool |
    ActionTypeEditRoleLabel |
    ActionTypeEditRoleBool |
    ActionTypeDeleteField |
    ActionTypeNewField
)

interface ActionTypeSet {
    type: 'set'
    state: EventDataRequest
}

interface ActionTypeEditSingle {
    type: 'edit_single'
    key: 'title' | 'description' | 'poster'
    value: string | null
}

interface ActionTypeEditPositionLabel {
    type: 'edit_position'
    index: number
    field_key: 'label'
    value: string
}

interface ActionTypeEditPositionBool {
    type: 'edit_position'
    index: number
    field_key: 'open' | 'can_regist'
    value: boolean
}

interface ActionTypeEditRoleLabel {
    type: 'edit_role'
    index: number
    field_key: 'label'
    value: string
}

interface ActionTypeEditRoleBool {
    type: 'edit_role'
    index: number
    field_key: 'can_appoint'
    value: boolean
}

interface ActionTypeDeleteField {
    type: 'delete_field'
    fields_name: 'positions' | 'roles'
    field_id: string
}

interface ActionTypeNewField {
    type: 'new_field'
    fields_name: 'positions' | 'roles'
}    

export default function eventDetailsReducer(state: EventDataRequest, action: EventDetailsReducerAction){
    switch(action.type){
        case 'set':
            return { ...action.state }
        case 'edit_single':
            return {
                ...state,
                [action.key]: action.value,
            }
        case 'edit_position':
            const newPositions = state.positions.map((field) => ({...field}))
            if(action.field_key === 'label'){
                newPositions[action.index].label = action.value
            } else{
                newPositions[action.index][action.field_key] = action.value
            }
            return {
                ...state,
                positions: newPositions
            }
        case 'edit_role':
            const newRoles = state.roles.map((field) => ({...field}))
            if(action.field_key === 'label'){
                newRoles[action.index].label = action.value
            } else{
                newRoles[action.index][action.field_key] = action.value
            }
            return {
                ...state,
                roles: newRoles
            }
        case 'delete_field': //fields_name, field_id
            return {
                ...state,
                [action.fields_name]: state[action.fields_name].filter((field) => field.id !== action.field_id),
            }
        case 'new_field': //fields_name
            const indexArray = state[action.fields_name].map((field) => {
                if(field.id.split('_').length === 2){
                    return Number(field.id.split('_')[1])
                } else{
                    return -1
                }
            })
            indexArray.sort((a, b) => a - b)
            let newIndex = 0
            for(const index of indexArray){
                if(index < 0){
                    continue
                }
                if(newIndex !== index){
                    break
                }
                newIndex++
            }
            if(action.fields_name === 'positions'){
                return {
                    ...state,
                    [action.fields_name]: state[action.fields_name].concat({
                        id:`position_${newIndex}`,
                        label:`Position ${newIndex+1}`,
                        open: false,
                        can_regist: false,
                    })
                }
            } else{
                return {
                    ...state,
                    [action.fields_name]: state[action.fields_name].concat({
                        id:`role_${newIndex}`,
                        label:`Role ${newIndex+1}`,
                        can_appoint: false,
                    })
                }
            }
        default:
            return {...state}
    }    
}