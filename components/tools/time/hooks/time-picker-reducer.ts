export interface TimePickerProperty {
    view: 'hour' | 'minute' | 'second'
    time: {
        meridiem: 'AM' | 'PM'
        hour: string
        minute: string
        second: string
    }
    selected_time: Date
}

interface ActionTypeSetDefault {
    type: 'set_default'
    time: TimePickerProperty['time']
    selected_time: TimePickerProperty['selected_time']
}

interface ActionTypeSetView {
    type: 'set_view'
    value: TimePickerProperty['view']
}

interface ActionTypeSetTime {
    type: 'set_time'
    key: keyof TimePickerProperty['time']
    value: string
}

export type TimePickerReducerAction = ActionTypeSetDefault | ActionTypeSetView | ActionTypeSetTime

export default function timePickerReducer(state: TimePickerProperty, action: TimePickerReducerAction): TimePickerProperty{
    switch(action.type){
        case 'set_default':
            return { ...state, time: action.time, selected_time: action.selected_time }
        case 'set_view':
            return { ...state, view: action.value }
        case 'set_time':
            return {
                ...state,
                time: {
                    ...state.time,
                    [action.key]: action.value
                },
                selected_time: getNewSelectedTime({ ...state.time, [action.key]: action.value }, state.selected_time)
            }
    }
}

function getNewSelectedTime(newTime: TimePickerProperty['time'], prevTime: Date): Date{
    const hour = isNaN(Number(newTime.hour))? prevTime.getHours() : Number(newTime.hour)
    const minute = isNaN(Number(newTime.minute))? prevTime.getMinutes() : Number(newTime.minute)
    const second = isNaN(Number(newTime.second))? prevTime.getSeconds() : Number(newTime.second)
    return new Date((new Date()).getFullYear(), 0, 0, hour%12 + (newTime.meridiem === 'PM'? 12 : 0), minute, second)
}