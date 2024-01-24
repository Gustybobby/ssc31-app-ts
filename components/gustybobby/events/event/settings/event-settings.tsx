"use client"

import DeleteSection from "./sections/delete-section"
import StatusSection from "./sections/status-section"
import { sectionStyles } from "@/components/styles/sections"

export default function EventSettings({ event_id }: { event_id: string }){
    return(
        <div className={sectionStyles.container()}>
            <StatusSection eventId={event_id}/>
            <DeleteSection eventId={event_id}/>
        </div>
    )
}

