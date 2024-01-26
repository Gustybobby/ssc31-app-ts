"use client"

import { sectionStyles } from "@/components/styles/sections"
import ManageAppointments from "./sections/manage-appointments"

export default function EventHours({ event_id }: { event_id: string }){

    return (
        <div className={sectionStyles.container()}>
            <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                <h1 className={sectionStyles.title({ color: 'teal', extensions: 'mb-2' })}>Distributions</h1>
                <ManageAppointments eventId={event_id}/>
            </div>
        </div>
    )
}