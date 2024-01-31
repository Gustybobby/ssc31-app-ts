"use client"

import { useFetchData } from "@/components/tools/api"

export default function useEventStatus(eventId: string){
    const { data: status, setData: setStatus, refetch } = useFetchData<boolean | 'loading' | 'error'>({
        apiUrl: `/api/gustybobby/events/${eventId}?online=1`,
        autoFetch: false,
        defaultState: 'loading',
        waitingState: 'loading',
        badState: 'error',
        accessor: 'online',
    })
    return { status, setStatus, refetch }
}