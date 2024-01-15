"use client"

import { type Dispatch, useEffect, useReducer, useState, type SetStateAction } from "react";
import scheduleStateReducer, { type ScheduleStateReducerAction, type ScheduleState, type Schedule } from "./schedule-state-reducer";
import { useSearchParams } from "next/navigation";

export interface UseSchedule {
    schedule: ScheduleState
    dispatchSchedule: Dispatch<ScheduleStateReducerAction>
    refetch: Dispatch<SetStateAction<{}>>
    view: string
    month: string | null
    year: string | null
    date_key: string | null
    appt_id: string | null
    edit: string | null
    editable: boolean
    role: 'gustybobby' | 'user'
    eventId: string
}

export default function useSchedule(fetchUrl: string, editable: boolean, role: 'gustybobby' | 'user', eventId: string){
    const [schedule, dispatchSchedule] = useReducer(scheduleStateReducer, 'loading')
    const [shouldRefetch, refetch] = useState({})
    const searchParams = useSearchParams()
    const view = searchParams.get('view') ?? 'month'
    const month = searchParams.get('month')
    const year = searchParams.get('year')
    const date_key = searchParams.get('date_key')
    const appt_id = searchParams.get('appt_id')
    const edit = searchParams.get('edit')
    useEffect(() => {
        fetch(fetchUrl)
            .then(res => res.ok? res.json() : { message: 'ERROR' })
            .then(data => data.message === 'SUCCESS'? data.data : 'error')
            .then(data => dispatchSchedule({ type: 'set_from_db', appt_array: data }))
    }, [fetchUrl, shouldRefetch])
    return { schedule, dispatchSchedule, refetch, view, month, year, date_key, appt_id, edit, editable, role, eventId }
}

export function safePositive(string: string | null): number | null{
    if(!string || isNaN(Number(string)) || Number(string) < 0){
        return null
    }
    return Number(string)
}

export function findAppointmentById(id: string, appointments: Schedule['appointments']){
    for(const {  appts } of Object.values(appointments)){
        if(appts[id]){
            return appts[id]
        }
    }
}