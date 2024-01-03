"use client"

import DashboardWrapper from "../dashboard-wrapper"
import DeleteSection from "./sections/delete-section"
import StatusSection from "./sections/status-section"
import { sectionStyles } from "@/components/styles/sections"

export default function EventSettings({ event_id, event_title }: { event_id: string, event_title: string }){
    return(
        <DashboardWrapper eventId={event_id} eventTitle={event_title}>
            <div className={sectionStyles.container()}>
                <StatusSection eventId={event_id}/>
                <DeleteSection eventId={event_id}/>
            </div>
        </DashboardWrapper>
    )
}

