"use client"

import type { ColumnFetches } from "@/server/typeconfig/event"
import { useEffect, useState } from "react"

export default function useColumnFetches({ eventId, role }: {
    eventId: string,
    role: 'user' | 'gustybobby'
}){
    const [columnFetches, setColumnFetches] = useState<ColumnFetches | 'loading' | 'error'>('loading')
    const [shouldRefetch, refetch] = useState({})
    useEffect(() => {
        fetch(`/api/${role}/events/${eventId}?column_fetches=1`)
            .then(res => res.ok? res.json() : { message: 'ERROR' })
            .then(data => data.message === 'SUCCESS'? data.data.column_fetches : 'error')
            .then(data => setColumnFetches(data))
    }, [eventId, role, shouldRefetch])
    return { columnFetches, refetch }
}