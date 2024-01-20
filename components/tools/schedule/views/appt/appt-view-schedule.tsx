"use client"

import { sectionStyles } from "@/components/styles/sections"
import { GustybobbyAppointment } from "@/server/typeconfig/record"
import { usePathname, useRouter } from "next/navigation"
import AppointmentBanner from "../../sections/appointment-banner"
import InterviewMembersTable from "./interview-members-table"
import { dateToDateKey } from "../../hooks/schedule-state-reducer"

export default function ApptViewSchedule({ eventId, role, appt, regist }: {
    eventId: string
    role: 'user' | 'gustybobby'
    appt: GustybobbyAppointment | undefined
    regist: boolean
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
                    onClick={() => router.push(pathname+`?view=day&date_key=${dateToDateKey(new Date(appt.start_at))}`)}
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
                    regist={regist}
                />
            </div>
            {appt.type === 'INTERVIEW' &&
            <InterviewMembersTable
                eventId={eventId}
                role={role}
                apptId={appt.id}
            />
            }
        </div>
    )
}