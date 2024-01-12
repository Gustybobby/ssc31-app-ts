"use client"

import { sectionStyles } from "@/components/styles/sections"
import DashboardWrapper from "../dashboard-wrapper"
import Schedule from "@/components/tools/schedule/schedule"
import useSchedule from "@/components/tools/schedule/hooks/use-schedule"

export default function EventSchedule({ event_id, event_title }: { event_id: string, event_title: string }){

    const scheduleHook = useSchedule(`/api/gustybobby/events/${event_id}/appointments`)
    
    return (
        <DashboardWrapper eventId={event_id} eventTitle={event_title}>
            <div className={sectionStyles.container()}>
                <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                    <h1 className={sectionStyles.title({ color: 'amber', extensions: 'mb-2' })}>Schedule</h1>
                    <Schedule {...scheduleHook}/>
                </div>
            </div>
        </DashboardWrapper>
    )
}