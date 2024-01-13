import type { EventConfigProperty } from "@/server/classes/eventconfig"
import type { FormConfigProperty } from "@/server/classes/forms/formconfig"
import { GustybobbyOption } from "@/server/typeconfig/form"
import { MemberStatus } from "@prisma/client"
import type { MutableRefObject } from "react"

export interface FormTableConfig {
    eventId: string
    formId: string
    role: 'user' | 'gustybobby'
}

export interface TableFormResponse {
    id: string
    form_id: string
    member_id: string
    user_id: string
    response: {
        [key: string]: string
    }
    snapshot: {
        [key: string]: string
    }
}

export interface Member {
    id: string
    status: MemberStatus
    position: {
        id: string
        label: string
    } | null
    role: {
        id: string
        label: string
    } | null
}

export type FormConfigState = FormConfigProperty | 'loading' | 'error'
export type ResponsesState = TableFormResponse[] | 'loading' | 'error'
export type MembersState = Member[] | 'loading' | 'error'

export interface StaticMembersTableInitializeState {
    formConfig: FormConfigState
    responses: ResponsesState
    members: MembersState
}

export interface EventTableConfig {
    eventId: string
    role: 'user' | 'gustybobby'
}

export type EventConfigState = EventConfigProperty | 'loading' | 'error'

export const statusOptions: GustybobbyOption[] = ['PENDING','SELECTED','ACTIVE','REJECTED'].map((status, index) => ({
    id: status,
    label: status,
    index,
    active: false
}))

export interface EditableMembersTableInitializeState extends StaticMembersTableInitializeState{
    eventConfig: EventConfigState
    editRef: MutableRefObject<{
        [key: string]: {
            [key: string]: string
        }
    }>
}