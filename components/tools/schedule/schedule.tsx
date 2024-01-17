"use client"

import { usePathname, useRouter } from "next/navigation"
import { dateKeyToDate, dateToDateKey } from "./hooks/schedule-state-reducer"
import { findAppointmentById, safePositive, type UseSchedule } from "./hooks/use-schedule"
import ScheduleLoading from "./schedule-loading"
import MonthViewSchedule from "./views/month/month-view-schedule"
import dynamic from "next/dynamic"
const ApptViewSchedule = dynamic(() => import("./views/appt/appt-view-schedule"), {
    loading: () => <ScheduleLoading/>
})
const DayViewSchedule = dynamic(() => import("./views/day/day-view-schedule"), {
    loading: () => <ScheduleLoading/>
})
const EditApptViewSchedule = dynamic(() => import("./views/appt/edit-appt-view-schedule/edit-appt-view-schedule"), {
    loading: () => <ScheduleLoading/>
})

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
        return <ScheduleLoading/>
    }
    if(view === 'month'){
        return (
            <MonthViewSchedule
                schedule={schedule}
                dispatchSchedule={dispatchSchedule}
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
                    refetch={refetch}
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