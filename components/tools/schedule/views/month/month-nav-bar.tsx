"use client"

import { sectionStyles } from "@/components/styles/sections"
import { monthNames } from "@/components/tools/date/date-picker"
import { getEditedMonthAndYear } from "@/components/tools/date/hooks/date-picker-reducer"
import { usePathname, useRouter } from "next/navigation"

export default function MonthNavBar({ month, year }: { month: number, year: number }){

    const router = useRouter()
    const pathname = usePathname()

    return (
        <div className="flex justify-center items-center border-b border-black dark:border-white text-2xl font-bold">
            <button 
                className={sectionStyles.button({ color: 'gray', border: true, hover: true, extensions: 'my-1' })}
                onClick={() => {
                    const { month: newMonth, year: newYear }= getEditedMonthAndYear(year, month, -1)
                    router.replace(pathname+`?view=month&month=${newMonth}&year=${newYear}`)
                }}
            >
                {'<'}
            </button>
            <span className="text-center w-48">
                {monthNames[month]} {year}
            </span>
            <button 
                className={sectionStyles.button({ color: 'gray', border: true, hover: true, extensions: 'my-1' })}
                onClick={() => {
                    const { month: newMonth, year: newYear }= getEditedMonthAndYear(year, month, +1)
                    router.replace(pathname+`?view=month&month=${newMonth}&year=${newYear}`)
                }}
            >
                {'>'}
            </button>
        </div>
    )
}