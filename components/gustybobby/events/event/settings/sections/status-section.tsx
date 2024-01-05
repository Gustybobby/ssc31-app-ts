"use client"

import { ErrorComponent } from "@/app/not-found"
import { sectionStyles } from "@/components/styles/sections"
import FetchingSVG from "@/components/svg/fetching-svg"
import { sendDataToAPI } from "@/components/tools/api"
import { SliderSwitch } from "@/components/tools/switch"
import { useEffect, useState } from "react"

export default function StatusSection({ eventId }: { eventId: string }){

    const [status, setStatus] = useState<boolean | 'loading' | 'error'>('loading')
    const [refetch, setRefetch] = useState(false)

    useEffect(() => {
        if(refetch === null){
            return
        }
        fetch(`/api/gustybobby/events/${eventId}?online=1`)
            .then(res => res.ok? res.json() : { message: 'ERROR' } )
            .then(data => data.message === 'SUCCESS'? data.data.online : 'error')
            .then(data => setStatus(data))
    }, [eventId, refetch])
    
    if(status === 'loading'){
        return(
            <div className="p-4 flex flex-col items-center justify-center space-y-4">
                <FetchingSVG/>
            </div>
        )
    }
    if(status === 'error'){
        return(
            <ErrorComponent/>
        )
    }
    return (
        <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
            <h1 className={sectionStyles.title({ color: 'sky', extensions: 'mb-2' })}>
                Event Status
            </h1>
            <div className="w-full flex bg-gray-200 dark:bg-black/80 p-3 space-x-4 rounded-lg font-semibold">
                <span>Toggle Event</span>
                <SliderSwitch
                    on={status}
                    onColor="bg-green-600"
                    offColor="bg-red-600"
                    pinColor="bg-white"
                    size="md"
                    onChange={async() => {
                        await sendDataToAPI({
                            apiUrl: `/api/gustybobby/events/${eventId}`,
                            method: 'PATCH',
                            body: JSON.stringify({ data: { online: !status } })
                        })
                        setRefetch(refetch => !refetch)
                    }}
                />
            </div>
        </div>
    )
}