"use client"

import { sectionStyles } from "@/components/styles/sections"
import { sendDataToAPI } from "@/components/tools/api"
import { SliderSwitch } from "@/components/tools/switch"
import StatusLoading from "./status-loading"
import useEventStatus from "./hooks/use-event-status"

export default function StatusSection({ eventId }: { eventId: string }){
    
    const { status, refetch } = useEventStatus(eventId)

    if(status === 'loading'){
        return <StatusLoading/>
    }
    if(status === 'error'){
        throw 'fetch event status error'
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
                        refetch({})
                    }}
                />
            </div>
        </div>
    )
}