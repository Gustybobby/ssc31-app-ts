export interface EventDataRequest {
    id?: string
    title: string
    description: string
    poster: string | null
    positions: PositionDataRequest[]
    roles: RoleDataRequest[]
    updated_at?: Date
}

export interface PositionDataRequest {
    id: string
    label: string
    open: boolean
    can_regist: boolean
}

export interface RoleDataRequest {
    id: string
    label: string
    can_appoint: boolean
}

export interface EventDefaultResponse {
    message: "SUCCESS" | "ERROR"
}

interface CreateEventSuccess {
    message: "SUCCESS"
    data: { id: string }
}

interface CreateEventError {
    message: "ERROR"
}

export type CreateEventResponse = CreateEventSuccess | CreateEventError

export type TableView = 'appt' | 'attd' | 'intv'

export type ColumnFetches = {
    [group_id: string]: {
        name: string,
        view_table: TableView[],
        order: number,
        forms: {
            [form_id: string]: string
        }
    }
} | null