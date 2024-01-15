"use client"

import type { TimePickerProperty } from "../hooks/time-picker-reducer"
import { type DispatchTimePicker, literalHour } from "../time-picker"
import { clockPosition, clockStyles } from "./clock"

interface TwelveClockProps extends DispatchTimePicker {
    timePicker: TimePickerProperty
}

export default function TwelveClock({ timePicker, dispatchTimePicker }: TwelveClockProps){
    return(
        <>
            {clockPosition.map((position,index) => (
            <button 
                key={'HOUR_'+index}
                className={clockStyles.clockButton({
                    selected: literalHour(index) === literalHour(timePicker.selected_time.getHours()),
                    extensions: position
                })}
                onClick={() => dispatchTimePicker({ type: 'set_time', key: 'hour', value: String(literalHour(index))})}
            >
                {literalHour(index)}
            </button>
            ))}
            <div className="w-16 h-16 rounded-full flex flex-col items-center">
                <button
                    className={styles.meridiemButton({
                        selected: timePicker.time.meridiem === 'AM',
                        extensions: 'rounded-t-full'
                    })}
                    onClick={() => dispatchTimePicker({ type: 'set_time', key: 'meridiem', value: 'AM' })}
                >
                    AM
                </button>
                <button
                    className={styles.meridiemButton({
                        selected: timePicker.time.meridiem === 'PM',
                        extensions: 'rounded-b-full'
                    })}
                    onClick={() => dispatchTimePicker({ type: 'set_time', key: 'meridiem', value: 'PM' })}
                >
                    PM
                </button>
            </div>
        </>
    )
}

const styles = {
    meridiemButton: ({ selected, extensions }: { selected: boolean, extensions?: string }) => [
        'w-16 h-8 font-bold',
        'transition-colors',
        'border border-black dark:border-white',
        selected? 'bg-gray-400' : 'hover:bg-gray-300 dark:hover:bg-gray-600',
        extensions,
    ].join(' ')
}