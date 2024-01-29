"use client"

import { sectionStyles } from "@/components/styles/sections"
import ManageAppointments from "./sections/manage-appointments/manage-appointments"
import { useState } from "react"
import dynamic from "next/dynamic"
const ManageDistribution = dynamic(() => import("./sections/manage-distribution/manage-distribution"))

export default function EventHours({ event_id }: { event_id: string }){

    const [startAt, setStartAt] = useState((new Date()).toISOString())
    const [endAt, setEndAt] = useState((new Date()).toISOString())

    return (
        <div className={sectionStyles.container()}>
            <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                <h1 className={sectionStyles.title({ color: 'teal', extensions: 'mb-2' })}>Appointments</h1>
                <ManageAppointments
                    eventId={event_id}
                    startAt={startAt}
                    setStartAt={setStartAt}
                    endAt={endAt}
                    setEndAt={setEndAt}
                />
            </div>
            <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                <h1 className={sectionStyles.title({ color: 'violet', extensions: 'mb-2' })}>Distributions</h1>
                <ManageDistribution
                    eventId={event_id}
                    startAt={startAt}
                    endAt={endAt}
                />
            </div>
        </div>
    )
}