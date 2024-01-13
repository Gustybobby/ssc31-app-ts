"use client"

import { dateToDateKey } from "./hooks/schedule-state-reducer"
import { safePositive, type UseSchedule } from "./hooks/use-schedule"
import DayViewSchedule from "./views/day/day-view-schedule"
import MonthViewSchedule from "./views/month/month-view-schedule"

export default function Schedule({
    schedule,
    dispatchSchedule,
    refetch,
    view,
    month,
    year,
    date_key,
    appt_id,
    edit,
    editable
}: UseSchedule){

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
                month={safePositive(month) ?? schedule.current_date.getMonth()}
                year={safePositive(year) ?? schedule.current_date.getFullYear()}
                editable={editable}
            />
        )
    }
    if(view === 'day'){
        return(
            <DayViewSchedule
                dateAppts={schedule.appointments[date_key ?? dateToDateKey(new Date())]}
                dateKey={date_key ?? dateToDateKey(new Date())}
                editable={editable}
            />
        )
    }
}