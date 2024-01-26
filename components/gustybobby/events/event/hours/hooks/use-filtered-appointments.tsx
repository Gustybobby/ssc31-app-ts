"use client"

import { AppointmentType } from "@prisma/client"
import { useEffect, useRef, useState } from "react"

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
    const [appointments, setAppointments] = useState<HoursAppointmentsState>('loading')
    const [shouldRefetch, refetch] = useState({})
    const refetchRef = useRef<{}|undefined>()

    useEffect(() => {
        if(refetchRef.current === shouldRefetch || !(startAt && endAt)){
            return
        }
        setAppointments('loading')
        refetchRef.current = shouldRefetch
        fetch(`/api/gustybobby/events/${eventId}/hours?` + [
            `start_at=${encodeURIComponent(startAt)}&end_at=${encodeURIComponent(endAt)}`,
            memberId? `member_id=${memberId}` : '',
            positionId? `position_id=${positionId}` : '',
            roleId? `role_id=${roleId}` : '',
        ].filter((string) => string !== '').join('&'))
            .then(res => res.ok? res.json() : { message: 'ERROR' })
            .then(data => data.message === 'SUCCESS'? data.data : 'error')
            .then(data => setAppointments(data))
        
    }, [eventId, startAt, endAt, memberId, positionId, roleId, shouldRefetch])

    return { appointments, refetch }
}