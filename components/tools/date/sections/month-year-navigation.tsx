"use client"

import { shortMonthNames, type DispatchDatePicker } from "../date-picker";
import type { DateProperty } from "../hooks/date-picker-reducer";

interface MonthYearNavigationProps extends DispatchDatePicker{
    pickerView: DateProperty['view']
}

export default function MonthYearNavigation({ pickerView, dispatchDatePicker }: MonthYearNavigationProps){
    return(
        <>
            <button 
                className={styles.tileButton}
                onClick={()=>dispatchDatePicker({ type: 'view_edit_year', direction: -1 })}
            >
                {'<<'}
            </button>
            <button 
                className={styles.tileButton}
                onClick={()=>dispatchDatePicker({ type: 'view_edit_month', direction: -1 })}
            >
                {'<'}
            </button>
            <div className={styles.monthYear}>{shortMonthNames[pickerView.month]} {pickerView.year}</div>
            <button 
                className={styles.tileButton}
                onClick={()=>dispatchDatePicker({ type: 'view_edit_month', direction: 1 })}
            >
                {'>'}
            </button>
            <button 
                className={styles.tileButton}
                onClick={()=>dispatchDatePicker({ type: 'view_edit_year', direction: 1 })}
            >
                {'>>'}
            </button>
        </>
    )
}

const styles = {
    monthYear: [
        'flex items-center justify-center',
        'text-lg font-bold',
        'col-span-3',
        'border-b border-black dark:border-white',
    ].join(' '),
    tileButton: [
        'flex items-center justify-center',
        'text-lg font-bold',
        'transition-colors',
        'border-b border-black dark:border-white',
        'hover:bg-gray-300 dark:hover:bg-gray-600',
    ].join(' '),
}