"use client"

import { getDatesInCalendar } from "@/components/tools/date/hooks/date-picker-reducer"
import { Schedule, dateToDateKey } from "../../hooks/schedule-state-reducer"
import { IconMap, getColorByIdHash, scheduleStyles } from "../../styles"
import { LiaPlusSolid } from "react-icons/lia"
import { HiOutlineArrowsExpand } from "react-icons/hi"
import { memo } from "react"
import { usePathname, useRouter } from "next/navigation"

function DayTilesComponent({ month, year, currentDate, editable, appts }: {
    month: number,
    year: number,
    currentDate: Date,
    editable: boolean,
    appts: Schedule['appointments']
}){

    const router = useRouter()
    const pathname = usePathname()

    return(
        <>
        {getDatesInCalendar(year, month).map((date,index) => {
            const sameDate = sameDay(date, currentDate) && sameMonth(date, currentDate)
            const sameMonthAsView = date.getMonth() === month
            const dateKey = dateToDateKey(date)
            return(
                <div 
                    key={date.toISOString()+'_'+index}
                    className={scheduleStyles.dayTile(sameDate, !sameMonthAsView, index)}
                >
                    {sameMonthAsView &&
                    <>
                        <div className="flex justify-between mb-2">
                            <span>{date.getDate()}</span>
                            <div className="flex space-x-1">
                                {editable &&
                                <button 
                                    className={scheduleStyles.dayTileButton('green')}
                                    onClick={() => router.push(pathname+`?view=appt&appt_id=new&edit=true&date_key=${dateToDateKey(date)}`)}
                                >
                                    <LiaPlusSolid/>
                                </button>
                                }
                                <button 
                                    className={scheduleStyles.dayTileButton('gray')}
                                    onClick={() => router.push(pathname+`?view=day&date_key=${dateToDateKey(date)}`)}
                                >
                                    <HiOutlineArrowsExpand/>
                                </button>
                            </div>
                        </div>
                        <AppointmentBanners
                            date={date}
                            dateAppts={appts[dateKey]}
                        />
                    </>
                    }
                </div>
            )
        })}
        </>
    )
}
const DayTiles = memo(DayTilesComponent)
export default DayTiles

function AppointmentBanners({ date, dateAppts }: {
    date: Date,
    dateAppts: Schedule['appointments']['key']
}){

    const router = useRouter()
    const pathname = usePathname()

    if(!dateAppts){
        return <></>
    }
    const apptKeyOrder = dateAppts.order
    const appts = dateAppts.appts
    return(
        <div className="flex flex-col space-y-1 overflow-y-auto">
        {apptKeyOrder.slice(0,2).map((key) => (
            <button 
                key={key}
                className={scheduleStyles.banner(getColorByIdHash(appts[key].id), apptKeyOrder.length === 1, false)}
                onClick={() => router.push(pathname+`?view=appt&appt_id=${appts[key].id}`)}
            >
                {appts[key].title}
                <div className="w-full h-full flex justify-center items-center text-4xl">
                    {apptKeyOrder.length === 1 && IconMap[appts[key].icon]}
                </div>
            </button>
        ))
        }
        {apptKeyOrder.length > 2 &&
            <button
                className={scheduleStyles.banner('gray', false, false)}
                onClick={() => router.push(pathname+`?view=day&date_key=${dateToDateKey(date)}`)}
            >
                {apptKeyOrder.length - 2} more...
            </button>
        }
        </div>
    )
}

function sameDay(date1: Date, date2: Date){
    return date1.getDate() === date2.getDate()
}

function sameMonth(date1: Date, date2: Date){
    return date1.getMonth() === date2.getMonth()
}