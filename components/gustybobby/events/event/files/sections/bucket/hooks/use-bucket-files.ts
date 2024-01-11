"use client"

import type { EventFile } from "@prisma/client"
import { useEffect, useState } from "react"

export default function useBucketFiles(eventId: string, shouldRefetch: {}){
    const [files, setFiles] = useState<EventFile[] | 'loading' | 'error'>('loading')
    useEffect(() => {
        fetch(`/api/gustybobby/events/${eventId}/files`)
            .then(res => res.ok? res.json() : { message: 'ERROR' })
            .then(data => data.message === 'SUCCESS'? data.data : 'error')
            .then(data => setFiles(data))
    }, [eventId, shouldRefetch])
    return { files, setFiles }
}