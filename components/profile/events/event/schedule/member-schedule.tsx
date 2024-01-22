"use client"

import { sectionStyles } from "@/components/styles/sections"
import Schedule from "@/components/tools/schedule/schedule"
import useSchedule from "@/components/tools/schedule/hooks/use-schedule"
import MemberDashboardWrapper from "../member-dashboard-wrapper"
import type { MemberStatus } from "@prisma/client"

export default function MemberSchedule({ event_id, event_title, can_appoint, can_regist, status }: {
    event_id: string
    event_title: string
    can_appoint: boolean
    can_regist: boolean
    status: MemberStatus
}){

    const scheduleHook = useSchedule(`/api/user/events/${event_id}/appointments`, can_appoint, can_regist, 'user', event_id, status)
    
    return (
        <MemberDashboardWrapper eventId={event_id} eventTitle={event_title}>
            <div className={sectionStyles.container()}>
                <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                    <h1 className={sectionStyles.title({ color: 'amber', extensions: 'mb-2' })}>Schedule</h1>
                    <Schedule {...scheduleHook}/>
                </div>
            </div>
        </MemberDashboardWrapper>
    )
}