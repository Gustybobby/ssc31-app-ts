import type { AppointmentType, IconType } from "@prisma/client"

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
    check_in: string
    check_out: string
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
    attendances: GustybobbyAttendance[]
}

export type GustybobbyAppointment = ReadOnlyAppointment | EditableAppointment