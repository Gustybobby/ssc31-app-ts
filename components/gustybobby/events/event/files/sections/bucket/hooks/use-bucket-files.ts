"use client"

import { useFetchData } from "@/components/tools/api"
import type { EventFile } from "@prisma/client"
import { useEffect } from "react"

export default function useBucketFiles(eventId: string, shouldRefetch: {}){
    const { data: files, setData: setFiles, refetch } = useFetchData<EventFile[] | 'loading' | 'error'>({
        apiUrl: `/api/gustybobby/events/${eventId}/files`,
        autoFetch: false,
        defaultState: 'loading',
        waitingState: 'loading',
        badState: 'error',
        fetchOnInit: false,
    })

    useEffect(() => {
        refetch({})
    }, [shouldRefetch, refetch])

    return { files, setFiles }
}