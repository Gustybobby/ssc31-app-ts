"use client"

import type { TimePickerProperty } from "../hooks/time-picker-reducer"
import { type DispatchTimePicker, literalHour } from "../time-picker"

interface TimeNavigationProps extends DispatchTimePicker{
    time: TimePickerProperty['time']
    view: TimePickerProperty['view']
}

export default function TimeNavigation({ time, view, dispatchTimePicker }: TimeNavigationProps){
    return(
        <div className="w-full h-8 flex border-b border-black dark:border-white">
            <button 
                className={styles.navButton(view === 'hour')}
                onClick={() => dispatchTimePicker({ type: 'set_view', value: 'hour' })}
            >
                {time.hour.padStart(2,'0')}
            </button>
            <div className="w-2 flex items-center justify-center text-lg">:</div>
            <button 
                className={styles.navButton(view === 'minute')}
                onClick={() => dispatchTimePicker({ type: 'set_view', value: 'minute' })}
            >
                {String(time.minute).padStart(2,'0')}
            </button>
            <div className="w-2 flex items-center justify-center text-lg">:</div>
            <button 
                className={styles.navButton(view === 'second')}
                onClick={() => dispatchTimePicker({ type: 'set_view', value: 'second' })}
            >
                {String(time.second).padStart(2,'0')}
            </button>
        </div>
    )
}

const styles = {
    navButton: (selected: boolean) => [
        'w-20 flex items-center justify-center',
        'text-lg font-bold',
        'transition-colors',
        selected? 'bg-gray-400' : 'hover:bg-gray-300 dark:hover:bg-gray-600',
    ].join(' '),
}