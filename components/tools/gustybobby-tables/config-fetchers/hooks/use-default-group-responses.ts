"use client"

import { useEffect, useState } from "react";
import type { DefaultResponsesState, GroupsState } from "../config-types";
import { eventColumnFetchesApiUrl } from "../config-urls";

export default function useDefaultGroupResponses({ eventId, role }: {
    eventId: string
    role: 'gustybobby' | 'user'
}){
    const [defaultResponses, setDefaultResponses] = useState<DefaultResponsesState>('loading')
    const [defaultGroups, setDefaultGroups] = useState<GroupsState>('loading')
    const [shouldRefetch, refetch] = useState({})
    useEffect(() => {
        setDefaultGroups('loading')
        setDefaultResponses('loading')
        fetch(eventColumnFetchesApiUrl({ eventId, role }))
            .then(res => res.ok? res.json() : { message: 'ERROR' })
            .then(data => data.message === 'SUCCESS'? data.data : 'error')
            .then((data: any) => {
                if(data === 'error'){
                    setDefaultResponses('error')
                    setDefaultGroups('error')
                    return
                }
                setDefaultResponses(data.group_responses)
                setDefaultGroups(data.groups)
            })
    }, [eventId, role, shouldRefetch])
    return { defaultResponses, defaultGroups, refetch }
}