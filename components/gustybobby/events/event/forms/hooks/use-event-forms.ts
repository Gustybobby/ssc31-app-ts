"use client"

import { useEffect, useState } from "react"
import type { FormCardConfig } from "../sections/form-cards-types"

export default function useEventForms(event_id: string){
    const [eventForms, setEventForms] = useState<FormCardConfig[]|'loading'|'error'>('loading')
    const [shouldRefetch, refetch] = useState({})
    useEffect(() => {
        fetch(`/api/gustybobby/events/${event_id}/forms?count_res=1&id=1&title=1&type=1&open=1&updated_at=1`)
            .then(res => res.ok? res.json() : { message: 'ERROR' })
            .then(data => data.message === 'SUCCESS'? data.data : 'error')
            .then(data => setEventForms(data))
    }, [event_id, shouldRefetch])
    return { eventForms, setEventForms, refetch }
}