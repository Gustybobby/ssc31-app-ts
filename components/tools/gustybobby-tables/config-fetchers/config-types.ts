import type { EventConfigProperty } from "@/server/classes/eventconfig"
import type { FormConfigProperty } from "@/server/classes/forms/formconfig"
import type { ColumnProperty } from "@/server/classes/table"
import type Table from "@/server/classes/table"
import type { SelectionResponse } from "@/server/modules/get-permitted-form-info"
import type { ColumnFetches, TableView } from "@/server/typeconfig/event"
import type { GustybobbyOption } from "@/server/typeconfig/form"
import type { EditableAppointment, GustybobbyAttendance } from "@/server/typeconfig/record"
import type { MemberStatus } from "@prisma/client"
import type { Dispatch, MutableRefObject, SetStateAction } from "react"

export interface EventTableConfig {
    eventId: string
    role: 'user' | 'gustybobby'
}

export interface AppointmentConfig extends EventTableConfig {
    apptId: string
}

export interface FormTableConfig extends EventTableConfig {
    formId: string
}

export interface DefaultGroupTableConfig extends EventTableConfig {
    tableView: TableView | null
    apptId?: string
}

export interface TableFormResponse {
    id: string
    member_id: string
    response: {
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

export interface MembersTableFormResponse extends TableFormResponse{
    member: Member | null
}

export interface MemberWithAttendance extends Member {
    attendance: GustybobbyAttendance | null
}

export interface DefaultResponses {
    [member_id: string]: {
        [field_id: string]: string
    }
}

export type ColumnFetchesState = ColumnFetches | 'loading' | 'error'
export type FormConfigState = FormConfigProperty | 'loading' | 'error'
export type ResponsesState = TableFormResponse[] | 'loading' | 'error'
export type DefaultResponsesState = DefaultResponses | 'loading' | 'error'
export type MembersState = Member[] | 'loading' | 'error'
export type AppointmentMembersState = MemberWithAttendance[] | 'loading' | 'error'
export type GroupsState = ColumnProperty[] | 'loading' | 'error'
export type SelectionResponsesState = SelectionResponse[] | 'loading' | 'error'

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

export interface UseDefaultMembersTable extends DefaultGroupTableConfig {
    options?: {
        columns?: {
            status: boolean,
            role: boolean,
            position: boolean,
        }
    }
}

export interface DefaultMembersTableInitializeState {
    groups: GroupsState
    defaultResponses: DefaultResponsesState
    members: MembersState
    options: UseDefaultMembersTable['options']
}

export interface UseSelectableMembersTable extends DefaultGroupTableConfig {
    selection: EditableAppointment['member_selects']
    transformation: Table['transformation']
}

export interface SelectableMembersTableInitiializeState {
    groups: GroupsState
    defaultResponses: DefaultResponsesState
    members: MembersState,
    memberSelects: EditableAppointment['member_selects']
    setMemberSelects: Dispatch<SetStateAction<UseSelectableMembersTable['selection']>>
    transformation: Table['transformation']
}

export interface UseAppointmentMembersTable extends DefaultGroupTableConfig {
    apptId: string
    transformation: Table['transformation']
}

export interface AppointmentMembersTableInitializeState {
    groups: GroupsState
    defaultResponses: DefaultResponsesState
    members: AppointmentMembersState,
    transformation: Table['transformation']
}

export interface AttendanceMembersTableInitializeState extends AppointmentMembersTableInitializeState{
    role: 'user' | 'gustybobby'
    apptId: string
    eventId: string,
    refetch: Dispatch<SetStateAction<{}>>
    hideButtons?: boolean
}