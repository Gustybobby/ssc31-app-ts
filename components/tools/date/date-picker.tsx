"use client"

import { inputStyles } from "@/components/styles/tools";
import { Popover, Transition } from "@headlessui/react";
import { type Dispatch, Fragment, memo, useReducer, useRef, useEffect } from "react";
import { FaRegCalendar } from "react-icons/fa";
import datePickerReducer, { type DatePickerReducerAction, type DateProperty } from "./hooks/date-picker-reducer";
import DateTiles from "./sections/date-tiles";
import MonthYearNavigation from "./sections/month-year-navigation";

interface DatePickerProps {
    id: string
    label: string | JSX.Element
    width?: string
    defaultValue?: string
    onChange?: (date: Date) => void
}

export interface DispatchDatePicker {
    dispatchDatePicker: Dispatch<DatePickerReducerAction>
}

export default function DatePicker({ id, label, width, defaultValue, onChange }: DatePickerProps){

    const [datePicker, dispatchDatePicker] = useReducer(datePickerReducer, {
        view: {
            year: (defaultValue? new Date(defaultValue) : new Date()).getFullYear(),
            month: (defaultValue? new Date(defaultValue) : new Date()).getDate(),
        },
        selected_date: (defaultValue? new Date(defaultValue) : new Date())
    } as DateProperty)
    const selectedDate = datePicker.selected_date
    const selectedDateRef = useRef(datePicker.selected_date)

    useEffect(() => {
        if(selectedDateRef.current !== selectedDate && onChange){
            onChange(selectedDate)
            selectedDateRef.current = selectedDate
        }
    }, [selectedDate, onChange])

    useEffect(() => {
        dispatchDatePicker({ type: 'set', date: defaultValue? new Date(defaultValue) : new Date()})
    }, [defaultValue])

    return(
        <div>
            <div className={inputStyles.label('default', 'lg')}>{label}</div>
            <Popover className="relative">
                <Popover.Button className={styles.popOverButton(width)}>
                    <div className="flex items-center space-x-2">
                        <FaRegCalendar/>
                        <span>{`${selectedDate.getDate()} ${shortMonthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`}</span>
                    </div>
                </Popover.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Popover.Panel className={styles.popOverPanel}>
                        <MonthYearNavigation
                            pickerView={datePicker.view}
                            dispatchDatePicker={dispatchDatePicker}
                        />
                        <DateTiles
                            selectedDate={datePicker.selected_date}
                            pickerView={datePicker.view}
                            dispatchDatePicker={dispatchDatePicker}
                        />
                    </Popover.Panel>
                </Transition>
            </Popover>
            <input id={id} type="hidden" value={selectedDate.toISOString()} readOnly={true}/>
            <input id={id+'_VALIDITY'} type="hidden" value={(!!selectedDate).toString()} readOnly={true}/>
        </div>
    )
}

export const monthNames = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const shortMonthNames = monthNames.map((name) => name.slice(0,3))
export const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const shortWeekDays = weekDays.map((day) => day.slice(0,3))

const styles = {
    popOverButton: (width?: string) => [
        'flex flex-row justify-between items-center',
        width ?? 'w-36',
        'px-2 py-1 rounded-md shadow-md',
        'border border-gray-400 dark:border-gray-700',
        'bg-gray-200 dark:bg-gray-800 transition-colors',
        'hover:border-black dark:hover:border-gray-400',
        'focus:outline-none'
    ].join(' '),
    popOverPanel: [
        'absolute grid grid-cols-7 gap-0',
        'w-72 h-64 z-10 mt-1 shadow-lg',
        'text-base sm:text-sm',
        'bg-gray-200 dark:bg-gray-700',
    ].join(' '),
}