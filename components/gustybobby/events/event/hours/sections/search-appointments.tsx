"use client"

import { sectionStyles } from "@/components/styles/sections"
import DatePicker from "@/components/tools/date/date-picker"
import type { Dispatch, SetStateAction } from "react"

interface SearchAppointmentsProps {
    startAt: string
    setStartAt: Dispatch<SetStateAction<string>>
    endAt: string
    setEndAt: Dispatch<SetStateAction<string>>
    refetch: Dispatch<SetStateAction<{}>>
}

export default function SearchAppointments({ startAt, setStartAt, endAt, setEndAt, refetch }: SearchAppointmentsProps){
    return (
        <div className="flex flex-col space-y-2">
            <div className="font-bold text-lg">Search appointments to distribute</div>
            <div className="flex space-x-2">
                <DatePicker
                    id="pick_start_at_search"
                    label="From"
                    width="w-36"
                    defaultValue={startAt}
                    onChange={(date) => setStartAt(date.toISOString())}
                />
                <DatePicker
                    id="pick_end_at_search"
                    label="To"
                    width="w-36"
                    defaultValue={endAt}
                    onChange={(date) => setEndAt(date.toISOString())}
                />
            </div>
            <button className={sectionStyles.button({ color: 'blue', hover: true , border: true })} onClick={() => refetch({})}>
                Search
            </button>
        </div>
    )
}