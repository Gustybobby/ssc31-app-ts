"use client"

import { useEffect, useState } from "react"
import useFilteredAppointments from "./use-filtered-appointments"

export interface UseManageAppointmentsProps {
    eventId: string
    startAt: string
    endAt: string
}

export default function useManageAppointments({ eventId, startAt, endAt }: UseManageAppointmentsProps){
    const { appointments, refetch } = useFilteredAppointments({ eventId, startAt, endAt })
    const [selectedApptId, setSelectedApptId] = useState<string | null>(null)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if(selectedApptId){
            setOpen(true)
            return
        }
    },[selectedApptId])

    useEffect(() => {
        if(!open){
            setSelectedApptId(null)
            return
        }
    }, [open])
 
    return { appointments, selectedApptId, setSelectedApptId, open, setOpen, refetch }
}