"use client"

import { sectionStyles } from "@/components/styles/sections"
import DashboardWrapper from "../dashboard-wrapper"
import Bucket from "./sections/bucket/bucket"

export default function EventFiles({ event_id, event_title}: { event_id: string, event_title: string }){
    return(
        <DashboardWrapper eventId={event_id} eventTitle={event_title}>
            <div className={sectionStyles.container()}>
                <Bucket eventId={event_id}/>
            </div>
        </DashboardWrapper>
    )
}