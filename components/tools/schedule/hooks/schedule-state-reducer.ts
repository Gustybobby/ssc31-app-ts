import type { GustybobbyAppointment } from "@/server/typeconfig/record"

export interface Schedule {
    next_appt: {
        appt: GustybobbyAppointment | null
        index: number
    },
    ongoing_appt: {
        appt: GustybobbyAppointment | null
        index: number
    }
    appointments: {
        [key: string]: {
            order: string[]
            appts: {
                [key: string]: GustybobbyAppointment
            }
        }
    }
    current_date: Date
}

export type ScheduleState = Schedule | 'loading' | 'error'

interface ActionTypeSetFromDb {
    type: 'set_from_db'
    appt_array: GustybobbyAppointment[] | 'error'
}

interface ActionTypeUpdateCurrDate {
    type: 'update_curr_date'
}

export type ScheduleStateReducerAction =
    ActionTypeSetFromDb |
    ActionTypeUpdateCurrDate

export default function scheduleStateReducer(state: ScheduleState, action: ScheduleStateReducerAction): ScheduleState{
    switch(action.type){
        case 'set_from_db':
            if(action.appt_array === 'error'){
                return 'error'
            }
            const currDate = new Date()
            const apptObject = getAppointmentArrayAsObject(action.appt_array)
            return {
                ...getNextAndOnGoingAppt(new Date(), apptObject),
                current_date: currDate,
                appointments: apptObject
            }
    }
    if(state === 'loading' || state === 'error'){
        throw 'cannot dispatch action while state is loading or error'
    }
    switch(action.type){
        case 'update_curr_date':
            return {
                ...state,
                current_date: new Date()
            }
    }
}

export function getAppointmentArrayAsObject(appt_array: GustybobbyAppointment[]): Schedule['appointments']{
    const apptsObject: Schedule['appointments'] = {}
    for(const appt of appt_array){
        const dateKeyStart = dateToDateKey(new Date(appt.start_at))
        const dateKeyEnd = dateToDateKey(new Date(appt.end_at))
        assignAppt(appt, dateKeyStart, apptsObject)
        if(dateKeyEnd !== dateKeyStart){
            assignAppt(appt, dateKeyEnd, apptsObject)
        }
    }
    for(const [dateKey, { appts }] of Object.entries(apptsObject)){
        const order = Object.keys(appts)
        order.sort((id1, id2) => (new Date(appts[id1].start_at)).getTime() - (new Date(appts[id2].start_at)).getTime())
        apptsObject[dateKey].order = order
    }
    return apptsObject
}

export function getNextAndOnGoingAppt(current_date: Date, apptsObject: Schedule['appointments']){
    let nextAppt: GustybobbyAppointment | null = null
    let nextApptIndex: number = 0
    let onGoingAppt: GustybobbyAppointment | null = null
    let onGoingApptIndex: number = 0
    for(const { order, appts } of Object.values(apptsObject)){
        order.forEach((appt_id, index) => {
            const appt = appts[appt_id]
            if((new Date(appt.end_at)) < current_date){
                return
            }
            if(current_date < new Date(appt.end_at) && current_date >= new Date(appt.start_at)){
                onGoingAppt = appt
                onGoingApptIndex = index
            }
            if((new Date(appt.start_at)) < current_date){
                return
            }
            if(!nextAppt){
                nextAppt = appt
                nextApptIndex = index
            }
            else if(new Date(nextAppt.start_at) > new Date(appt.start_at)){
                nextAppt = appt
                nextApptIndex = index
            }
        })
    }
    return {
        next_appt: { appt: nextAppt, index: nextApptIndex },
        ongoing_appt: { appt: onGoingAppt, index: onGoingApptIndex },
    }
}

function assignAppt(appt: GustybobbyAppointment, dateKey: string, apptsObject: Schedule['appointments']){
    apptsObject[dateKey] = apptsObject[dateKey] ?? { order: [], appts: {} }
    apptsObject[dateKey].appts[appt.id] = appt
}

export function dateToDateKey(date: Date): string{
    return [
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
    ].join('-')
}

export function dateKeyToDate(dateKey: string): Date{
    const [year,month,day] = dateKey.split('-')
    return new Date(Number(year), Number(month), Number(day))
}