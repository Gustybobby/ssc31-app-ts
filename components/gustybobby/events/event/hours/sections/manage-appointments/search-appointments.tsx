"use client"

import { sectionStyles } from "@/components/styles/sections"
import DatePicker from "@/components/tools/date/date-picker"
import TimePicker, { getCombinedDateTime } from "@/components/tools/time/time-picker"
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
            <div className="font-bold text-lg">Search appointments to distribute hours</div>
            <div className="flex space-x-2">
                <div className="flex flex-col">
                    <DatePicker
                        id="pick_start_at_date_search"
                        label="From"
                        width="w-36"
                        defaultValue={startAt}
                        onChange={(date) => setStartAt(getCombinedDateTime(new Date(startAt), date).toISOString())}
                    />
                    <TimePicker
                        id="pick_start_at_time_search"
                        label=""
                        buttonClassName="w-36"
                        defaultValue={startAt}
                        onChange={(date) => setStartAt(getCombinedDateTime(date, new Date(startAt)).toISOString())}
                    />
                </div>
                <div className="flex flex-col">
                    <DatePicker
                        id="pick_end_at_date_search"
                        label="To"
                        width="w-36"
                        panelClassName="-translate-x-36 md:translate-x-0"
                        defaultValue={endAt}
                        onChange={(date) => setEndAt(getCombinedDateTime(new Date(endAt), date).toISOString())}
                    />
                    <TimePicker
                        id="pick_end_at_time_search"
                        label=""
                        buttonClassName="w-36"
                        panelClassName="-translate-x-28 md:translate-x-0"
                        defaultValue={endAt}
                        onChange={(date) => setEndAt(getCombinedDateTime(date, new Date(endAt)).toISOString())}
                    />
                </div>
            </div>
            <button className={sectionStyles.button({ color: 'green', hover: true , border: true })} onClick={() => refetch({})}>
                Search
            </button>
        </div>
    )
}