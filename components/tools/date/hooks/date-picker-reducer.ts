
export interface DateProperty {
    view: {
        year: number
        month: number
        dates_in_calendar: Date[]
    }
    selected_date: Date
}

interface ActionTypeSetDatePicker {
    type: 'set'
    date: Date
}

interface ActionTypeViewEditYear {
    type: 'view_edit_year'
    direction: -1 | 1
}

interface ActionTypeViewEditMonth {
    type: 'view_edit_month'
    direction: -1 | 1
}

interface ActionTypeEditSelectedDate {
    type: 'edit_selected_date'
    date: Date
}

export type DatePickerReducerAction =
    ActionTypeSetDatePicker |
    ActionTypeViewEditYear |
    ActionTypeViewEditMonth |
    ActionTypeEditSelectedDate

export default function datePickerReducer(state: DateProperty, action: DatePickerReducerAction): DateProperty{
    switch(action.type){
        case 'set':
            const setYear = action.date.getFullYear()
            const setMonth = action.date.getMonth()
            return {
                view: {
                    year: setYear,
                    month: setMonth,
                    dates_in_calendar: getDatesInCalendar(setYear, setMonth)
                },
                selected_date: action.date
            }
        case 'view_edit_year':
            const editedYear = state.view.year + action.direction
            return {
                ...state,
                view: {
                    ...state.view,
                    year: editedYear,
                    dates_in_calendar: getDatesInCalendar(editedYear, state.view.month)
                }
            }
        case 'view_edit_month':
            const { year: editYear, month: editMonth } = getEditedMonthAndYear(state.view.year, state.view.month, action.direction)
            return {
                ...state,
                view: {
                    ...state.view,
                    year: editYear,
                    month: editMonth,
                    dates_in_calendar: getDatesInCalendar(editYear, editMonth),
                }
            }
        case 'edit_selected_date':
            return {
                ...state,
                selected_date: action.date
            }
    }
}

export function getEditedMonthAndYear(year: number, month: number, amount: number){
    return {
        year: year + Math.floor((month+amount)/12),
        month: (month+12+amount)%12,
    }
}

export function getDatesInCalendar(year: number, month: number){
    const firstDate = new Date(year, month, 1)
    const dateList: Date[] = []
    var i = -firstDate.getDay()+1
    while(dateList.length < 42){
        dateList.push(new Date(year, month, i))
        i++
    }
    return dateList
}