"use client"

import { shortWeekDays } from "@/components/tools/date/date-picker";
import type { Schedule } from "../../hooks/schedule-state-reducer";
import AppointmentBanner from "../../sections/appointment-banner";
import MonthNavBar from "./month-nav-bar";
import DayTiles from "./day-tiles";
import { usePathname, useRouter } from "next/navigation";
import { UseSchedule } from "../../hooks/use-schedule";

export default function MonthViewSchedule({ schedule, month, year, editable, dispatchSchedule }: {
    schedule: Schedule,
    month: number,
    year: number,
    editable: boolean,
    dispatchSchedule: UseSchedule['dispatchSchedule']
}){

    const router = useRouter()
    const pathname = usePathname()

    return(
        <div className="bg-gray-200 dark:bg-black/40 border border-black dark:border-white">
            <div className="grid grid-cols-1 md:grid-cols-2 md:border-b md:border-black md:dark:border-white">
                {schedule.ongoing_appt.appt &&
                <div className="p-2 border-b md:border-b-0 md:border-r border-black dark:border-white">
                    <div className="font-bold text-xl mb-1">Ongoing</div>
                    <div
                        className="w-full cursor-pointer"
                        onClick={() => router.push(pathname+`?view=appt&appt_id=${schedule.ongoing_appt.appt?.id}`)}
                    >
                        <AppointmentBanner
                            appt={schedule.ongoing_appt.appt}
                            hideDetails={true}
                            regist={false}
                            dispatchSchedule={dispatchSchedule}
                        />
                    </div>
                </div>
                }
                {schedule.next_appt.appt &&
                <div className="p-2 border-b md:border-b-0 border-black dark:border-white">
                    <div className="font-bold text-xl mb-1">Upcoming</div>
                    <div
                        className="w-full cursor-pointer"
                        onClick={() => router.push(pathname+`?view=appt&appt_id=${schedule.next_appt.appt?.id}`)}
                    >
                        <AppointmentBanner
                            appt={schedule.next_appt.appt}
                            hideDetails={true}
                            regist={false}
                            dispatchSchedule={dispatchSchedule}
                        />
                    </div>
                </div>
                }
            </div>
            <MonthNavBar
                month={month}
                year={year}
            />
            <div className="w-full min-h-screen h-full border-black dark:border-white overflow-auto">
                <div className="w-[60rem] md:w-full grid grid-cols-7">
                {shortWeekDays.map((day, index) => (
                    <div 
                        key={day+'_'+index}
                        className="text-center border-black dark:border-white border-b font-bold"
                    >
                        {day}
                    </div>
                ))}
                </div>
                <div className="w-[60rem] md:w-full grid grid-cols-7">
                    <DayTiles
                        month={month}
                        year={year}
                        currentDate={schedule.current_date}
                        editable={editable}
                        appts={schedule.appointments}
                    />
                </div>
            </div>
        </div>
    )
}