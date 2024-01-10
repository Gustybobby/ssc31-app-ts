"use client"

import { memo } from "react"
import { shortWeekDays, type DispatchDatePicker } from "../date-picker"
import type { DateProperty } from "../hooks/date-picker-reducer"

interface DateTilesProps extends DispatchDatePicker {
    selectedDate: DateProperty['selected_date']
    pickerView: DateProperty['view']
}

function DateTilesComponent({ selectedDate, pickerView, dispatchDatePicker }: DateTilesProps){
    return(
        <>
            {shortWeekDays.map((day,index) => (
            <div key={day+'_'+index} className={styles.weekDay}>
                {day}
            </div>
            ))}
            {pickerView.dates_in_calendar.map((date) => (
            <button
                key={date.toDateString()}
                className={styles.dayButton(
                    date.getMonth() === pickerView.month,
                    date.toDateString() === selectedDate.toDateString()
                )}
                onClick={()=>dispatchDatePicker({ type: 'edit_selected_date', date })}
            >
                {date.getDate()}
            </button>
            ))}
        </>
    )
}
const DateTiles = memo(DateTilesComponent)
export default DateTiles

const styles = {
    weekDay: [
        'flex items-center justify-center',
        'text-lg',
    ].join(' '),
    dayButton: (correctMonth: boolean, selected: boolean) => [
        'flex items-center justify-center',
        'text-lg',
        correctMonth? '' : 'text-gray-400',
        selected? 'font-bold bg-gray-400 dark:bg-gray-500' : 'hover:bg-gray-300 dark:hover:bg-gray-600',
    ].join(' '),
}