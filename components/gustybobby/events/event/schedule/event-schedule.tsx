"use client"

import { sectionStyles } from "@/components/styles/sections"
import Schedule from "@/components/tools/schedule/schedule"
import useSchedule from "@/components/tools/schedule/hooks/use-schedule"

export default function EventSchedule({ event_id }: { event_id: string }){

    const scheduleHook = useSchedule(`/api/gustybobby/events/${event_id}/appointments`, true, true, 'gustybobby', event_id, 'ACTIVE')
    
    return (
        <div className={sectionStyles.container()}>
            <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                <h1 className={sectionStyles.title({ color: 'amber', extensions: 'mb-2' })}>Schedule</h1>
                <Schedule {...scheduleHook}/>
            </div>
        </div>
    )
}