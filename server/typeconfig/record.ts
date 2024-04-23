import type { AppointmentType, IconType } from "@prisma/client"
import type { EventConfigPosition, EventConfigRole } from "./form"

export interface ActivityRecord {
    appt_id: string
    label: string
    hrs: number
    start_at: Date
    end_at: Date
}

export interface TransferRecord {
    hrs: number
    semester: number
    year: number
}

export interface StudentMember { 
    id: string
    student_id: string
    position: {
        id: string
        label: string
    } | null
    role: {
        id: string
        label: string
    } | null
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
    public: boolean
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

export interface ReadOnlyAppointment extends CoreAppointment {
    permission: 'read_only'
    attendance: GustybobbyAttendance | null
}

export interface EditableAppointment extends CoreAppointment {
    permission: 'editable'
    party_members: {
        id: string,
        user_id: string,
        position: EventConfigPosition | null,
        role: EventConfigRole | null,
    }[]
    member_selects?: {
        [member_id: string]: boolean
    }
}

export type GustybobbyAppointment = ReadOnlyAppointment | EditableAppointment

export const ApptTypes = {
    INTERVIEW: {
        id: 'INTERVIEW',
        label: 'Interview',
        admin_only: true,
    },
    MEETING: {
        id: 'MEETING',
        label: 'Meeting',
        admin_only: false,
    },
    ACTIVITY: {
        id: 'ACTIVITY',
        label: 'Activity',
        admin_only: false,
    }
}