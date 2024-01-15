"use client"

import { sectionStyles } from "@/components/styles/sections"
import { GustybobbyAppointment } from "@/server/typeconfig/record"
import { usePathname, useRouter } from "next/navigation"
import AppointmentBanner from "../../sections/appointment-banner"

export default function ApptViewSchedule({ appt }: {
    appt: GustybobbyAppointment | undefined
}){

    const router = useRouter()
    const pathname = usePathname()

    if(!appt){
        router.replace(pathname)
        return <></>
    }

    const year = (new Date(appt.start_at)).getFullYear()
    const month = (new Date(appt.start_at)).getMonth()

    return(
        <div className="min-h-screen bg-gray-200 dark:bg-black/40 border border-black dark:border-white">
            <div className="p-1 flex justify-between md:grid md:grid-cols-3 border-b border-black dark:border-white">
                <button
                    className={sectionStyles.button({ color: 'gray', border: true, hover: true })}
                    onClick={() => router.push(pathname+`?view=month&year=${year}&month=${month}`)}
                >
                    Back
                </button>
                <span className="font-bold text-2xl text-center">
                    Appointment
                </span>
            </div>
            <div className="m-2">
                <AppointmentBanner
                    appt={appt}
                    hideDetails={false}
                />
            </div>
        </div>
    )
}