"use client"

import type { dispatchApptConfig } from "../edit-appt-view-schedule"

interface PartySelectorTableProps extends dispatchApptConfig {
    eventId: string
    role: 'gustybobby' | 'user'
}

export default function PartySelectorTable({ eventId, role, dispatchApptConfig }: PartySelectorTableProps){

    return(
       <></> 
    )
}