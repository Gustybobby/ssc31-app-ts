import DatePicker from "@/components/tools/date/date-picker";
import type { Schedule } from "@/components/tools/schedule/hooks/schedule-state-reducer";
import TimePicker from "@/components/tools/time/time-picker";
import { conflictedAppointments } from "@/server/appointmentfunction";
import { useMemo } from "react";
import { dispatchApptConfig } from "../edit-appt-view-schedule";

interface DateTimePickerProps extends dispatchApptConfig {
    apptId: string
    startAt: string
    endAt: string
    appts: Schedule['appointments']['key']['appts']
}

export default function DateTimePicker({ apptId, startAt, endAt, appts, dispatchApptConfig }: DateTimePickerProps){

    const confliction = useMemo(() => 
        conflictedAppointments({ apptId, startAt, endAt }, Object.values(appts))
    ,[apptId, startAt, endAt, appts])

    return(
        <div className="space-y-1">
            <DatePicker
                id="appt_date_field"
                label="Date"
                defaultValue={startAt}
                onChange={(value) => dispatchApptConfig({ type: 'edit_date', date: value.toISOString() })}
            />
            <div className="flex justify-between md:justify-start md:space-x-4">
                <TimePicker
                    id="appt_startat_field"
                    label="Start At"
                    defaultValue={startAt}
                    onChange={(value) => dispatchApptConfig({ type: 'edit_time', key: 'start_at', time: value.toISOString() })}
                />
                <TimePicker
                    id="appt_endat_field"
                    label="End At"
                    defaultValue={endAt}
                    onChange={(value) => dispatchApptConfig({ type: 'edit_time', key: 'end_at', time: value.toISOString() })}
                    panelClassName="-translate-x-28 md:translate-x-0"
                />
            </div>
            <div className="flex flex-col">
                {(startAt > endAt) &&
                    <span className="text-red-600 dark:text-red-400 font-bold">Invalid: Start At is more than End At</span>
                }
                {confliction &&
                    <span className="text-yellow-600 dark:text-yellow-400 font-bold">
                        Warning: Confliction with&nbsp;
                        <span className="inline-block">{confliction.title}</span>&nbsp; 
                        {`(${(new Date(confliction.start_at)).toLocaleTimeString()} - ${(new Date(confliction.end_at)).toLocaleTimeString()})`}
                    </span>
                }
            </div>
        </div>
    )
}