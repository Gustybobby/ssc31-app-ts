"use client"

import { type Dispatch, useEffect, useReducer, useState, type SetStateAction } from "react";
import scheduleStateReducer, { type ScheduleStateReducerAction, type ScheduleState } from "./schedule-state-reducer";
import { useSearchParams } from "next/navigation";

export interface UseSchedule {
    schedule: ScheduleState
    dispatchSchedule: Dispatch<ScheduleStateReducerAction>
    refetch: Dispatch<SetStateAction<{}>>
    view: string
    date_key: string | null
    appt_id: string | null
}

export default function useSchedule(fetchUrl: string){
    const [schedule, dispatchSchedule] = useReducer(scheduleStateReducer, 'loading')
    const [shouldRefetch, refetch] = useState({})
    const searchParams = useSearchParams()
    const view = searchParams.get('view') ?? 'month'
    const date_key = searchParams.get('date_key')
    const appt_id = searchParams.get('appt_id')
    useEffect(() => {
        fetch(fetchUrl)
            .then(res => res.ok? res.json() : { message: 'ERROR' })
            .then(data => data.message === 'SUCCESS'? data.data : 'error')
            .then(data => dispatchSchedule({ type: 'set_from_db', appt_array: data }))
    }, [fetchUrl, shouldRefetch])
    return { schedule, dispatchSchedule, refetch, view, date_key, appt_id }
}