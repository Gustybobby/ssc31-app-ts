import type { GustybobbyAppointment } from "./typeconfig/record"

export function conflictedAppointments({
    apptId,
    startAt,
    endAt
}: {
    apptId: string,
    startAt: string,
    endAt: string,
}, dateAppts: GustybobbyAppointment[]){
    for(const appt of dateAppts){
        if(appt.id === apptId){
            continue
        }
        const start = getTimeInSeconds(new Date(appt.start_at))
        const end = getTimeInSeconds(new Date(appt.end_at))
        const targetStart = getTimeInSeconds(new Date(startAt))
        const targetEnd = getTimeInSeconds(new Date(endAt))
        const targetIntervalBefore = targetStart < start && targetEnd <= start
        const targetIntervalAfter = targetStart >= end && targetEnd > end
        if (targetIntervalBefore || targetIntervalAfter){
            continue
        }
        return appt
    }
    return null
}

function getTimeInSeconds(date: Date){
    return date.getHours()*3600 + date.getMinutes()*60 + date.getSeconds()
}
