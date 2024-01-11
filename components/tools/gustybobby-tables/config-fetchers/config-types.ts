import type { FormConfigProperty } from "@/server/classes/forms/formconfig"
import type { MemberStatus } from "@prisma/client"

export interface FormTableConfig {
    eventId: string
    formId: string
    role: 'user' | 'gustybobby'
}

export interface FormResponse {
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
export type ResponsesState = FormResponse[] | 'loading' | 'error'
export type MembersState = Member[] | 'loading' | 'error'

export interface StaticMembersTableState {
    formConfig: FormConfigProperty
    responses: FormResponse[]
    members: Member[]
}