"use client"

import type { UseSchedule } from "./hooks/use-schedule"
import MonthViewSchedule from "./views/month/month-view-schedule"

export default function Schedule({ schedule, dispatchSchedule, refetch, view, date_key, appt_id }: UseSchedule){

    if(schedule === 'error'){
        throw 'fetch appointments error'
    }
    if(schedule === 'loading'){
        return <>Loading</>
    }
    if(view === 'month'){
        return(
            <MonthViewSchedule
                schedule={schedule}
            />
        )
    }
}