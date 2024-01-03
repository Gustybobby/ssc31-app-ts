export interface EventDataRequest {
    title: string
    description: string
    poster: string | null
    positions: PositionDataRequest[]
    roles: RoleDataRequest[]
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