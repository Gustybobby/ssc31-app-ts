"use client"

import { useEffect, useState } from "react";
import type { AppointmentConfig, MembersWithAttendanceState } from "../config-types";
import { membersWithAttendanceApiUrl } from "../config-urls";

export default function useMembersWithAttendance({ eventId, role, apptId }: AppointmentConfig){
    const [members, setMembers] = useState<MembersWithAttendanceState>('loading')
    const [shouldRefetch, refetch] = useState({})
    useEffect(() => {
        setMembers('loading')
        fetch(membersWithAttendanceApiUrl({ eventId, role, apptId }))
            .then(res => res.ok? res.json() : { message: 'ERROR' })
            .then(data => data.message === 'SUCCESS'? data.data : 'error')
            .then(data => {
                setMembers(data.party_members.map((member: any) => ({
                    ...member,
                    attendance: member.attendances[0] ?? null,
                    attendances: undefined,
                })))
            })
    }, [eventId, role, apptId, shouldRefetch])
    return { members, refetch }
}