"use client"

import type { TimePickerProperty } from "../hooks/time-picker-reducer"
import type { DispatchTimePicker } from "../time-picker"
import { clockPosition, clockStyles } from "./clock"

interface SixtyClockProps extends DispatchTimePicker{
    timePicker: TimePickerProperty
    timeKey: 'minute' | 'second'
}

export default function SixtyClock({ timeKey, timePicker, dispatchTimePicker }: SixtyClockProps){

    const currentKeyValue = timeKey === 'minute'? timePicker.selected_time.getMinutes() : timePicker.selected_time.getSeconds()

    return(
        <>
        {clockPosition.map((position,index) => (
            <button
                key={timeKey+'_'+index}
                className={clockStyles.clockButton({
                    selected: index*5 === currentKeyValue,
                    extensions: position
                })}
                onClick={() => dispatchTimePicker({ type: 'set_time', key: timeKey, value: String(index*5) })}
            >
                {index*5}
            </button>
        ))}
            <input
                value={timePicker.time[timeKey]}
                onChange={(e) => dispatchTimePicker({ type: 'set_time', key: timeKey, value: e.target.value })}
                type="text"
                className="bg-gray-200 dark:bg-gray-800 rounded-full border border-white text-lg text-center font-bold w-16 p-4"
            />
        </>
    )
}