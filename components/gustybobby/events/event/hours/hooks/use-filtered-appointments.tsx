"use client"

import type { AppointmentType } from "@prisma/client"
import { useEffect, useRef, useState } from "react"
import { hoursAppointmentUrl } from "../urls"

export interface HoursAppointment {
    id: string
    title: string
    type: AppointmentType
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
    const [appointments, setAppointments] = useState<HoursAppointmentsState>([])
    const [shouldRefetch, refetch] = useState({})
    const refetchRef = useRef<{}>(shouldRefetch)

    useEffect(() => {
        if(refetchRef.current === shouldRefetch || !(startAt && endAt)){
            return
        }
        setAppointments('loading')
        refetchRef.current = shouldRefetch
        fetch(hoursAppointmentUrl({ eventId, startAt, endAt, memberId, positionId, roleId }))
            .then(res => res.ok? res.json() : { message: 'ERROR' })
            .then(data => data.message === 'SUCCESS'? data.data : 'error')
            .then(data => setAppointments(data))
    }, [eventId, startAt, endAt, memberId, positionId, roleId, shouldRefetch])

    return { appointments, refetch }
}