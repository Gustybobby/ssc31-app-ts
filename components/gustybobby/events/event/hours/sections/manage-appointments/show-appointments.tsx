import { sectionStyles } from "@/components/styles/sections";
import type { HoursAppointment } from "../../hooks/use-filtered-appointments";
import type { Dispatch, SetStateAction } from "react";

export default function ShowAppointments({ appointments, setSelectedApptId }: {
    appointments: HoursAppointment[]
    setSelectedApptId: Dispatch<SetStateAction<string | null>>
}) {
    return(
        <div className="overflow-auto max-h-96">
            <div className="w-[72rem] md:w-full">
                <div className="grid grid-cols-12 bg-gray-200 dark:bg-gray-800 font-bold">
                    <span className="p-2 border border-black dark:border-white text-center">Manage</span>
                    <span className="p-2 border border-black dark:border-white col-span-3">Title</span>
                    <span className="p-2 border border-black dark:border-white col-span-2">Start At</span>
                    <span className="p-2 border border-black dark:border-white col-span-2">End At</span>
                    <span className="p-2 border border-black dark:border-white col-span-2">Participants</span>
                    <span className="p-2 border border-black dark:border-white col-span-2">Hours</span>
                </div>
                {appointments.length > 0? appointments.map((appt) => (
                    <div key={appt.id} className="bg-gray-100 dark:bg-gray-700">
                        <div className="grid grid-cols-12">
                            <div className="flex justify-center p-2 border border-black dark:border-white">
                                <button
                                    className={sectionStyles.button({ color: 'blue', hover: true, border: true })}
                                    onClick={() => setSelectedApptId(appt.id)}
                                >
                                    View
                                </button>
                            </div>
                            <span className="p-2 border border-black dark:border-white col-span-3">
                                {appt.title}
                            </span>
                            <span className="p-2 border border-black dark:border-white col-span-2">
                                {(new Date(appt.start_at)).toLocaleString()}
                            </span>
                            <span className="p-2 border border-black dark:border-white col-span-2">
                                {(new Date(appt.end_at)).toLocaleString()}
                            </span>
                            <span className="p-2 border border-black dark:border-white col-span-2">
                                {appt._count.party_members}
                            </span>
                            <span className="p-2 border border-black dark:border-white col-span-2">
                                {getTimeDifferenceInHours(new Date(appt.start_at), new Date(appt.end_at))}
                            </span>
                        </div>
                    </div>
                ))
                :
                <div className="p-2 bg-gray-100 dark:bg-gray-700 border border-black dark:border-white md:text-center">
                    No appointment in this time period
                </div>
                }
            </div>
        </div>
    )
}

function getTimeDifferenceInHours(date1: Date, date2: Date){
    return (date2.getTime() - date1.getTime())/3600000
}