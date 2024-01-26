"use client"

import { useEffect, useState } from "react"
import useFilteredAppointments from "./use-filtered-appointments"

export default function useManageAppointments({ eventId }: { eventId: string }){
    const [startAt, setStartAt] = useState((new Date()).toISOString())
    const [endAt, setEndAt] = useState((new Date()).toISOString())
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
 
    return { startAt, setStartAt, endAt, setEndAt, appointments, selectedApptId, setSelectedApptId, open, setOpen, refetch }
}