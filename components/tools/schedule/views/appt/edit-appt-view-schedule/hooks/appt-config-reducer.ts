import type { EditableAppointment } from "@/server/typeconfig/record";
import type { AppointmentType, IconType } from "@prisma/client";

interface ActionTypeSetAppt {
    type: 'set_appt'
    appt: EditableAppointment
}

interface ActionTypeEditDate {
    type: 'edit_date'
    date: string
}

interface ActionTypeEditTime {
    type: 'edit_time'
    key: 'start_at' | 'end_at'
    time: string
}

interface ActionTypeEditString {
    type: 'edit_string'
    key: 'title' | 'description' | 'location',
    value: string
}

interface ActionTypeEditBoolean {
    type: 'edit_boolean'
    key: 'attendance_required'
    value: boolean
}

interface ActionTypeEditIcon {
    type: 'edit_icon'
    value: IconType
}

interface ActionTypeEditType {
    type: 'edit_type'
    value: AppointmentType
}

export type ApptConfigReducerAction =
    ActionTypeSetAppt |
    ActionTypeEditDate |
    ActionTypeEditTime |
    ActionTypeEditString |
    ActionTypeEditBoolean |
    ActionTypeEditIcon |
    ActionTypeEditType

export default function apptConfigReducer(state: EditableAppointment, action: ApptConfigReducerAction): EditableAppointment{
    switch(action.type){
        case 'set_appt':
            return {
                ...action.appt,
                _count: { ...action.appt._count },
                party_members: action.appt.party_members.map((member) => ({ ...member })),
                attendances: action.appt.attendances.map((attendance) => ({ ...attendance })),
            }
        case 'edit_date':
            return {
                ...state,
                start_at: combineDateTime(action.date, state.start_at).toISOString(),
                end_at: combineDateTime(action.date, state.end_at).toISOString(),
            }
        case 'edit_time':
            return {
                ...state,
                [action.key]: combineDateTime(state[action.key], action.time).toISOString(),
            }
        case 'edit_string':
        case 'edit_boolean':
            return {
                ...state,
                [action.key]: action.value
            }
        case 'edit_icon':
            return {
                ...state,
                icon: action.value
            }
        case 'edit_type':
            return {
                ...state,
                type: action.value
            }
    }
}

function combineDateTime(dateString: string, timeString: string){
    const date = new Date(dateString)
    const time = new Date(timeString)
    return (new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
        time.getSeconds()
    ))
}