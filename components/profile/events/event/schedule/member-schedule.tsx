"use client"

import { sectionStyles } from "@/components/styles/sections"
import Schedule from "@/components/tools/schedule/schedule"
import useSchedule from "@/components/tools/schedule/hooks/use-schedule"
import type { MemberStatus } from "@prisma/client"

export default function MemberSchedule({ event_id, can_appoint, can_regist, status }: {
    event_id: string
    can_appoint: boolean
    can_regist: boolean
    status: MemberStatus
}){

    const scheduleHook = useSchedule(`/api/user/events/${event_id}/appointments`, can_appoint, can_regist, 'user', event_id, status)
    
    return (
        <div className={sectionStyles.container()}>
            <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                <h1 className={sectionStyles.title({ color: 'amber', extensions: 'mb-2' })}>Schedule</h1>
                <Schedule {...scheduleHook}/>
            </div>
        </div>
    )
}