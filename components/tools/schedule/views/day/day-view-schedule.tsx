import { sectionStyles } from "@/components/styles/sections"
import { monthNames } from "@/components/tools/date/date-picker"
import { usePathname, useRouter } from "next/navigation"
import AppointmentBanner from "../../sections/appointment-banner"
import { Schedule } from "../../hooks/schedule-state-reducer"

export default function DayViewSchedule({ dateAppts, dateKey, editable }: {
    dateAppts: Schedule['appointments']['key']
    dateKey: string
    editable: boolean
}){

    const router = useRouter()
    const pathname = usePathname()
    const apptKeyOrder = dateAppts?.order
    const appts = dateAppts?.appts
    const [year,month,day] = dateKey.split('-')

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
                    {day} {monthNames[Number(month)]} {year}
                </span>
            </div>
            {dateAppts?
            <div className="m-2 space-y-2">
                {apptKeyOrder.map((key) => (
                <div
                    className="cursor-pointer"
                    key={key}
                    onClick={() => router.push(pathname+`?view=appt&appt_id=${appts[key].id}`)}
                >
                    <AppointmentBanner
                        appt={appts[key]}
                        hideDetails={false}
                    />
                </div>
                ))}
            </div>
            :
            <div className="m-2 flex justify-center font-bold text-xl">
                No Appointments Today
            </div>
            }
            {editable &&
            <div className="m-2">
                <button
                    className="w-full h-16 shadow-lg rounded-lg text-xl font-bold transition-colors bg-green-400 dark:bg-green-600 hover:bg-green-500"
                    onClick={() => router.push(pathname+`?view=appt&appt_id=new&edit=true&date_key=${dateKey}`)}
                >
                    Create New
                </button>
            </div>
            }
        </div>
    )
}