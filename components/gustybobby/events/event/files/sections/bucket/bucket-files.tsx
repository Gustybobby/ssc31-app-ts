"use client"

import FetchingSVG from "@/components/svg/fetching-svg"
import type { EventFile } from "@prisma/client"
import { useEffect, useState } from "react"
import FileCard from "./file-card"

export default function BucketFiles({ eventId, refetch }: { eventId: string, refetch: boolean }){

    const [files, setFiles] = useState<EventFile[] | 'loading' | 'error'>('loading')
    
    useEffect(() => {
        if(refetch === null){
            return
        }
        fetch(`/api/gustybobby/events/${eventId}/files`)
            .then(res => res.ok? res.json() : { message: 'ERROR' })
            .then(data => data.message === 'SUCCESS'? data.data : 'error')
            .then(data => setFiles(data))
    }, [eventId, refetch])

    if(files === 'loading'){
        return <div className="flex justify-center"><FetchingSVG/></div>
    }
    if(files === 'error'){
        throw 'fetch files error'
    }
    return(
        <div className="mb-2 flex flex-wrap gap-2">
            {files.map((file) => (
                <FileCard
                    key={file.id}
                    eventId={eventId}
                    id={file.id}
                    label={file.label ?? ''}
                    url={file.url}
                    setFiles={setFiles}
                />
            ))}
        </div>
    )
}