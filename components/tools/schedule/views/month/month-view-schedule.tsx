"use client"

import type { Schedule } from "../../hooks/schedule-state-reducer";
import AppointmentBanner from "../../sections/appointment-banner";

export default function MonthViewSchedule({ schedule }: { schedule: Schedule }){
    return(
        <div className="bg-gray-200 dark:bg-black/40 border border-black dark:border-white">
            <div className="p-2 border-b border-black dark:border-white">
                <div className="font-bold text-xl mb-1">Next Appointment</div>
                {schedule.next_appt.appt &&
                <button className="w-full" onClick={() => {}}>
                    <AppointmentBanner
                        appt={schedule.next_appt.appt}
                        apptIndex={schedule.next_appt.index}
                        hideDetails={true}
                    />
                </button>
                }
            </div>
        </div>
    )
}