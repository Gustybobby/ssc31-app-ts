import type { AppointmentType, IconType } from "@prisma/client"
import type { EventConfigPosition, EventConfigRole } from "./form"

export interface ActivityRecord {
    label: string
    hrs: number
    date: Date
}

export interface TransferRecord {
    hrs: number
    semester: number
    year: number
}

export interface GustybobbyAttendance {
    id: string
    check_in: string | null
    check_out: string | null
    member_id: string
}

interface CoreAppointment {
    id: string
    title: string
    location: string
    description: string
    icon: IconType
    type: AppointmentType
    start_at: string
    end_at: string
    attendance_required: boolean
    _count: {
        party_members: number
    }
}

interface ReadOnlyAppointment extends CoreAppointment {
    permission: 'read_only'
    attendance: GustybobbyAttendance
}

interface EditableAppointment extends CoreAppointment {
    permission: 'editable'
    party_members: {
        id: string,
        user_id: string,
        position: EventConfigPosition | null,
        role: EventConfigRole | null,
    }[]
    attendances: GustybobbyAttendance[]
}

export type GustybobbyAppointment = ReadOnlyAppointment | EditableAppointment