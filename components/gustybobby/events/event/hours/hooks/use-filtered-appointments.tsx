"use client"

import type { AppointmentType } from "@prisma/client"
import { hoursAppointmentUrl } from "../urls"
import { useFetchData } from "@/components/tools/api"

export interface HoursAppointment {
    id: string
    title: string
    type: AppointmentType
    public: boolean
    start_at: string
    end_at: string
    _count: {
        party_members: number
    }
}

export type HoursAppointmentsState = HoursAppointment[] | 'loading' | 'error'

export interface UseFilteredAppointmentsProps {
    eventId: string
    startAt?: string
    endAt?: string
    memberId?: string
    positionId?: string
    roleId?: string
}

export default function useFilteredAppointments({ eventId, startAt, endAt, memberId, positionId, roleId }: UseFilteredAppointmentsProps){
    const { data: appointments, setData: setAppointments, refetch } = useFetchData<HoursAppointmentsState>({
        apiUrl: hoursAppointmentUrl({ eventId, startAt: startAt ?? '', endAt: endAt ?? '', memberId, positionId, roleId }),
        autoFetch: false,
        defaultState: [],
        waitingState: 'loading',
        badState: 'error',
        fetchOnInit: false,
    })
    return { appointments, setAppointments, refetch }
}