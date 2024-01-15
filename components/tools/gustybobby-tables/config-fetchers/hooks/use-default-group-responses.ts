"use client"

import { useEffect, useState } from "react";
import type { GroupsState, ResponsesState } from "../config-types";
import { eventColumnFetchesApiUrl } from "../config-urls";

export default function useDefaultGroupResponses({ eventId, role }: {
    eventId: string
    role: 'gustybobby' | 'user'
}){
    const [defaultResponses, setDefaultResponses] = useState<ResponsesState>('loading')
    const [defaultGroups, setDefaultGroups] = useState<GroupsState>('loading')
    useEffect(() => {
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
    }, [eventId, role])
    console.log(defaultGroups, defaultResponses)
    
    return { defaultResponses, defaultGroups }
}