import { Popover, Transition } from "@headlessui/react";
import { Dispatch, Fragment, useEffect, useReducer, useRef } from "react";
import { FaRegClock } from "react-icons/fa";
import timePickerReducer, { type TimePickerReducerAction } from "./hooks/time-picker-reducer";
import { inputStyles } from "@/components/styles/tools";
import TimeNavigation from "./sections/time-navigation";
import Clock from "./sections/clock";

interface TimePickerProps {
    id: string
    label: string | JSX.Element
    buttonClassName?: string
    panelClassName?: string
    defaultValue?: string
    onChange?: (time: Date) => void
}

export interface DispatchTimePicker {
    dispatchTimePicker: Dispatch<TimePickerReducerAction>
}

export default function TimePicker({ id, label, buttonClassName, panelClassName, defaultValue, onChange }: TimePickerProps){

    const [timePicker, dispatchTimePicker] = useReducer(timePickerReducer, {
        view: 'hour',
        time: getDefaultTime(defaultValue),
        selected_time: defaultValue? new Date(defaultValue) : new Date(),
    })
    const selectedTime = timePicker.selected_time
    const selectedTimeRef = useRef(selectedTime)

    useEffect(() => {
        dispatchTimePicker({
            type: 'set_default',
            time: getDefaultTime(defaultValue),
            selected_time: defaultValue? new Date(defaultValue) : new Date(),
        })
    }, [defaultValue])

    useEffect(() => {
        if(selectedTime !== selectedTimeRef.current && onChange){
            onChange(selectedTime)
            selectedTimeRef.current = selectedTime
        }
        console.log(selectedTime)
    }, [selectedTime, onChange])
    

    return(
        <div>
            <div className={inputStyles.label('default', 'lg')}>{label}</div>
            <Popover className="relative">
                <Popover.Button className={styles.popOverButton(buttonClassName)}>
                    <div className="flex items-center space-x-2">
                        <FaRegClock/>
                        <span>{formatTimeString(timePicker.selected_time, timePicker.time.meridiem)}</span>
                    </div>
                </Popover.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Popover.Panel className={styles.popOverPanel(panelClassName)}>
                        <TimeNavigation
                            time={timePicker.time}
                            view={timePicker.view}
                            dispatchTimePicker={dispatchTimePicker}
                        />
                        <Clock timePicker={timePicker} dispatchTimePicker={dispatchTimePicker}/>
                    </Popover.Panel>
                </Transition>
            </Popover>
            <input id={id} type="hidden" value={selectedTime.toISOString()} readOnly={true}/>
            <input id={id+'_VALIDITY'} type="hidden" value={(!!selectedTime).toString()} readOnly={true}/>
        </div>
    )
}

function getDefaultTime(defaultValue?: string){
    const currentTime = defaultValue? new Date(defaultValue) : new Date()
    const { hour, meridiem } = getHourTwelveFormat(currentTime.getHours())
    return {
        meridiem,
        hour: String(hour),
        minute: String(currentTime.getMinutes()),
        second: String(currentTime.getSeconds()),
    }
}

function getHourTwelveFormat(hour: number): { hour: number, meridiem: 'AM' | 'PM' }{
    return { hour: hour % 12 || 12, meridiem: hour < 12? 'AM' : 'PM' }
}

function formatTimeString(time: Date, meridiem: 'AM' | 'PM'): string{
    const { hour } = getHourTwelveFormat(time.getHours())
    return [
        String(hour).padStart(2,'0'),
        String(time.getMinutes()).padStart(2,'0'),
        String(time.getSeconds()).padStart(2,'0'),
    ].join(':') + ' ' + meridiem
}

export function literalHour(hr: number): number{
    return (hr % 12) || 12
}

const styles = {
    popOverButton: (buttonClassName?: string) => [
        'flex flex-row justify-between items-center',
        'px-2 py-1 rounded-md shadow-md',
        'border border-gray-400 dark:border-gray-700',
        'bg-gray-200 dark:bg-gray-800 transition-colors',
        'hover:border-black dark:hover:border-gray-400',
        'focus:outline-none',
        buttonClassName ?? '',
    ].join(' '),
    popOverPanel: (panelClassName?: string) => [
        'absolute',
        'w-64 h-72 z-10 mt-1 shadow-lg',
        'text-base sm:text-sm',
        'bg-gray-100 dark:bg-gray-700',
        panelClassName ?? '',
    ].join(' '),
}