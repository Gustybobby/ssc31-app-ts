"use client"

import { usePathname, useRouter } from "next/navigation"
import { dateKeyToDate, dateToDateKey } from "./hooks/schedule-state-reducer"
import { findAppointmentById, safePositive, type UseSchedule } from "./hooks/use-schedule"
import ApptViewSchedule from "./views/appt/appt-view-schedule"
import DayViewSchedule from "./views/day/day-view-schedule"
import MonthViewSchedule from "./views/month/month-view-schedule"
import EditApptViewSchedule from "./views/appt/edit-appt-view-schedule/edit-appt-view-schedule"

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
    editable,
    role,
    eventId,
}: UseSchedule){

    const router = useRouter()
    const pathname = usePathname()

    if(schedule === 'error'){
        throw 'fetch appointments error'
    }
    if(schedule === 'loading'){
        return <>Loading</>
    }
    if(view === 'month'){
        return (
            <MonthViewSchedule
                schedule={schedule}
                month={safePositive(month) ?? schedule.current_date.getMonth()}
                year={safePositive(year) ?? schedule.current_date.getFullYear()}
                editable={editable}
            />
        )
    }
    if(view === 'day'){
        return (
            <DayViewSchedule
                dateAppts={schedule.appointments[date_key ?? dateToDateKey(new Date())]}
                dateKey={date_key ?? dateToDateKey(new Date())}
                editable={editable}
            />
        )
    }
    if(view === 'appt'){
        const appt = findAppointmentById(appt_id ?? '', schedule.appointments)
        if(edit === 'true' && (appt?.permission === 'editable') || (!appt && appt_id === 'new')){
            return (
                <EditApptViewSchedule
                    eventId={eventId}
                    appt={appt}
                    dateAppts={schedule.appointments[date_key ?? '']?.appts ?? []}
                    role={role}
                    date={date_key? dateKeyToDate(date_key) : new Date()}
                />
            )
        }
        return (
            <ApptViewSchedule
                appt={appt}
            />
        )
    }
    router.replace(pathname)
    return <></>
}