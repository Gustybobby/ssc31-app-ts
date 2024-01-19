"use client"

import { useEffect, useState } from "react";
import type { AppointmentConfig, AppointmentMembersState } from "../config-types";
import { appointmentMembersApiUrl } from "../config-urls";

export default function useAppointmentMembers({ eventId, role, apptId }: AppointmentConfig){
    const [members, setMembers] = useState<AppointmentMembersState>('loading')
    const [shouldRefetch, refetch] = useState({})
    useEffect(() => {
        setMembers('loading')
        fetch(appointmentMembersApiUrl({ eventId, role, apptId }))
            .then(res => res.ok? res.json() : { message: 'ERROR' })
            .then(data => data.message === 'SUCCESS'? data.data : 'error')
            .then(data => {
                setMembers(data.party_members.map((member: any) => ({
                    ...member,
                    attendance: member.attendances?.[0] ?? null,
                    attendances: undefined,
                })))
            })
    }, [eventId, role, apptId, shouldRefetch])
    return { members, refetch }
}