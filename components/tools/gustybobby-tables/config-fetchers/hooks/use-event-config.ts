"use client"

import { useEffect, useState } from "react"
import type { EventConfigState, EventTableConfig } from "../config-types"
import { eventApiUrl } from "../config-urls"

export default function useEventConfig({ eventId, role }: EventTableConfig){
    const [eventConfig, setEventConfig] = useState<EventConfigState>('loading')
    const [shouldRefetch, refetch] = useState({})
    useEffect(() => {
        setEventConfig('loading')
        fetch(eventApiUrl({ eventId, role }))
            .then(res => res.ok? res.json() : { message: 'ERROR' })
            .then(data => data.message === 'SUCCESS'? data.data : 'error')
            .then(data => setEventConfig(data))
    }, [eventId, role, shouldRefetch])
    return { eventConfig, refetch }
}