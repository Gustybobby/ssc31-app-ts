import { useEffect, useState } from "react";
import { MdAccessTimeFilled, MdLocationOn, MdOutlineEdit } from "react-icons/md";
import { BiSolidDetail } from "react-icons/bi";
import { HiUserGroup } from "react-icons/hi";
import { IconMap, colorCycle, scheduleStyles } from "../styles";
import type { GustybobbyAppointment } from "@/server/typeconfig/record";
import { sectionStyles } from "@/components/styles/sections";
import { usePathname, useRouter } from "next/navigation";
import { shortMonthNames, shortWeekDays } from "../../date/date-picker";

export default function AppointmentBanner({ appt, apptIndex, hideDetails }: {
    appt: GustybobbyAppointment
    apptIndex: number
    hideDetails: boolean
}){

    const [apptTiming, setApptTiming] = useState(timing(new Date(), new Date(appt.start_at), new Date(appt.end_at)))
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const interval = setInterval(() => setApptTiming(timing(new Date(), new Date(appt.start_at), new Date(appt.end_at))), 5000)
        return () => clearInterval(interval);
    },[appt])

    return(
        <div className={scheduleStyles.banner(colorCycle[apptIndex%colorCycle.length], false, true)}>
            <div className="flex justify-between">
                <span className="flex items-center font-bold text-2xl mb-1">
                    <span className="text-2xl">{IconMap[appt.icon]}</span>&nbsp;<span>{appt.title}</span>
                </span>
                {appt.permission === 'editable' &&
                <button 
                    className={sectionStyles.button({ color: 'orange', border: true, hover: true })}
                    onClick={() => router.push(pathname+`?view=appt&appt_id=${appt.id}`)}
                >
                    <MdOutlineEdit className="text-2xl"/>
                </button>
                }
            </div>
            <span className="text-left text-lg mb-1">
                {getFormattedDateString(new Date(appt.start_at))}, {(new Date(appt.start_at)).toLocaleTimeString()}
            </span>
            <TimingStatus apptTiming={apptTiming}/>
            {!hideDetails &&
            <AppointmentDetails appt={appt}/>
            }
        </div> 
    )
}

function TimingStatus({ apptTiming }: { apptTiming: Timing }){
    return(
        <span className="font-bold text-lg px-2 py-1 w-fit bg-white/70 dark:bg-black/40 rounded-lg shadow-lg mb-1">
            <>
                {apptTiming.type === 'UPCOMING' && <span>Starting in&nbsp;</span>}
                {apptTiming.type === 'STARTED' &&
                <>
                    <span className="text-green-600 dark:text-green-400">
                        🟢Active
                    </span>
                    &nbsp;Ending in&nbsp;
                </>
                }
                {apptTiming.type === 'ENDED' && <span className="text-red-600 dark:text-red-400">🔴Ended&nbsp;</span>}
            </>
            {apptTiming.type !== 'ENDED' &&
            <span className="inline-block">
                {apptTiming.time.day > 0 &&
                <span className="text-purple-600 dark:text-purple-400">
                    {apptTiming.time.day} days&nbsp;
                </span>
                }
                {apptTiming.time.hour > 0 &&
                <span className="text-pink-600 dark:text-pink-400">
                    {apptTiming.time.hour} hours&nbsp;
                </span>
                }
                {apptTiming.time.min > 0 &&
                <span className="text-green-600 dark:text-green-400">
                    {apptTiming.time.min} minutes
                </span>
                }
            </span>
            }
        </span>
    )
}

function AppointmentDetails({ appt }: { appt: GustybobbyAppointment }){
    return(
        <div className="flex flex-col p-2 rounded-lg shadow-lg bg-white/20 dark:bg-black/20 font-bold text-lg">
            <span className="flex items-center">
                <MdAccessTimeFilled/>&nbsp;Start At: {new Date(appt.start_at).toLocaleTimeString()}
            </span>
            <span className="flex items-center">
                <MdAccessTimeFilled/>&nbsp;End At: {new Date(appt.end_at).toLocaleTimeString()}
            </span>
            <span className="flex items-center"><MdLocationOn/>&nbsp;Location:</span>
            <span className="flex items-center ml-5 text-base font-normal">{appt.location ?? 'Unspecified'}</span>
            <span className="flex items-center"><BiSolidDetail/>&nbsp;Description:</span>
            <span className="flex items-center ml-5 text-base font-normal">{appt.description}</span>
            <span className="flex items-center"><HiUserGroup/>&nbsp;{appt._count.party_members} Participants</span>
        </div>
    )
}

function getTimeDiff(date1: Date, date2: Date){
    const diff = Math.abs(date1.getTime() - date2.getTime())
    let min = Math.ceil(diff/60000)
    const day = Math.floor(min/60/24)
    min -= day*60*24
    const hour = Math.floor(min/60)
    min -= hour*60
    return { day, hour, min }
}

type Timing = {
    type: 'ENDED',
    time: null
} | {
    type: 'UPCOMING' | 'STARTED',
    time: {
        day: number
        hour: number
        min: number
    }
}

function timing(currDate: Date, dateStart: Date, dateEnd: Date): Timing{
    if(currDate > dateEnd){
        return {
            type: 'ENDED',
            time: null,
        }
    }
    if(currDate >= dateStart){
        return {
            type: 'STARTED',
            time: getTimeDiff(dateEnd, currDate)
        }
    }
    return {
        type: 'UPCOMING',
        time: getTimeDiff(dateStart, currDate)
    }
}

function getFormattedDateString(date: Date){
    return `${shortWeekDays[date.getDay()]} ${date.getDate()} ${shortMonthNames[date.getMonth()]} ${date.getFullYear()}`
}