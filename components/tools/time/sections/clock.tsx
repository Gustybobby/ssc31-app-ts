"use client"

import { TimePickerProperty } from "../hooks/time-picker-reducer"
import { DispatchTimePicker } from "../time-picker"
import SixtyClock from "./sixty-clock"
import TwelveClock from "./twelve-clock"

interface ClockProps extends DispatchTimePicker{
    timePicker: TimePickerProperty
}

export default function Clock({ timePicker, dispatchTimePicker }: ClockProps){
    return(
        <div className="absolute w-64 h-64 flex items-center justify-center">
            <div className="relative bg-gray-200 dark:bg-gray-900 w-56 h-56 rounded-full">
            </div>
            <div className="absolute w-full h-full flex items-center justify-center">
                {timePicker.view === 'hour' && <TwelveClock timePicker={timePicker} dispatchTimePicker={dispatchTimePicker}/>}
                {timePicker.view === 'minute' && <SixtyClock timeKey="minute" timePicker={timePicker} dispatchTimePicker={dispatchTimePicker}/>}
                {timePicker.view === 'second' && <SixtyClock timeKey="second" timePicker={timePicker} dispatchTimePicker={dispatchTimePicker}/>}
            </div>
        </div>
    )
}

export const clockPosition = [
    'top-4 right-28',
    'top-7 right-16',
    'top-16 right-7',
    'top-28 right-4',
    'bottom-16 right-7',
    'bottom-7 right-16',
    'bottom-4 right-28',
    'bottom-7 left-16',
    'bottom-16 left-7',
    'bottom-28 left-4',
    'top-16 left-7',
    'top-7 left-16',
]

export const clockStyles = {
    clockButton: ({ selected, extensions }: { selected: boolean, extensions?: string }) => [
        'absolute flex items-center justify-center',
        'w-8 h-8 rounded-full',
        'transition-colors',
        selected? 'bg-gray-400' : 'hover:bg-gray-300 dark:hover:bg-gray-600',
        extensions,
    ].join(' '),
}