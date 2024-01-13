"use client"

import { useEffect, useState } from "react";
import type { MembersState, FormTableConfig } from "../config-types";
import { membersApiUrl } from "../config-urls";

export default function useMembers({ eventId, formId, role }: FormTableConfig){
    const [members, setMembers] = useState<MembersState>('loading')
    const [shouldRefetch, refetch] = useState({})
    useEffect(() => {
        setMembers('loading')
        fetch(membersApiUrl({ eventId, formId, role }))
            .then(res => res.ok? res.json() : { message: 'ERROR' })
            .then(data => data.message === 'SUCCESS'? data.data : 'error')
            .then(data => setMembers(data))
    }, [eventId, formId, role, shouldRefetch])
    return { members, setMembers, refetch }
}