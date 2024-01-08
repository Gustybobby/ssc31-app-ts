"use client"

import GustybobbyTable from "@/components/tools/gustybobby-table/gustybobby-table"
import DashboardWrapper from "../dashboard-wrapper"
import { sectionStyles } from "@/components/styles/sections"

export default function EventMembers({ event_id, event_title }: { event_id: string, event_title: string }){
    return(
        <DashboardWrapper eventId={event_id} eventTitle={event_title}>
            <div className={sectionStyles.container()}>
                <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                    <h1 className={sectionStyles.title({ color: 'amber', extensions: 'mb-2' })}>
                        Members
                    </h1>
                    <GustybobbyTable/>
                </div>
            </div>
        </DashboardWrapper>
    )
}