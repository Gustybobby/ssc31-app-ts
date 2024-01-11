"use client"

import { useEffect, useState } from "react"

export default function useEventStatus(eventId: string){
    const [status, setStatus] = useState<boolean | 'loading' | 'error'>('loading')
    const [shouldRefetch, refetch] = useState({})
    useEffect(() => {
        fetch(`/api/gustybobby/events/${eventId}?online=1`)
            .then(res => res.ok? res.json() : { message: 'ERROR' } )
            .then(data => data.message === 'SUCCESS'? data.data.online : 'error')
            .then(data => setStatus(data))
    }, [eventId, shouldRefetch])
    return { status, setStatus, refetch }
}