import { ActivityRecord } from "../typeconfig/record"

export interface AppointmentWithHoursContext {
    id: string
    title: string
    start_at: Date
    end_at: Date
    attendances: {
        check_in: Date | null
        check_out: Date | null
        member_id: string
    }[]
    party_members: {
        id: string
    }[]
}

export type DistributionMode = "APPT_INTERVAL" | "MARKED" | "CHECK" | "CHECK_IN" | "CHECK_OUT"

export const distributionModes = [
    {
        id: "APPT_INTERVAL",
        label: "Appointment"
    },
    {
        id: "MARKED",
        label: "Marked"
    },
    {
        id: "CHECK",
        label: "Attendance",
    }, 
    {
        id: "CHECK_IN",
        label: "Check-in only",
    },
    {
        id: "CHECK_OUT",
        label: "Check-out only",
    }
]

interface MemberActivityRecord extends ActivityRecord {
    member_id: string
}

export function calculateHoursDistribution(appts: AppointmentWithHoursContext[], mode: DistributionMode){
    const distObject: { [member_id: string]: ActivityRecord[] } = {}
    for(const appt of appts){
        const records = getSingleDistribution(appt, mode)
        for(const { member_id, ...record } of records){
            distObject[member_id] = distObject[member_id] ?? []
            distObject[member_id].push(record)
        }
    }
    for(const records of Object.values(distObject)){
        records.sort((r1, r2) => (r1.start_at < r2.start_at? -1 : 1))
    }
    return distObject
}

function getSingleDistribution(appt: AppointmentWithHoursContext, mode: DistributionMode): MemberActivityRecord[]{
    const attendancesMap = Object.fromEntries(appt.attendances.map((attd) => [attd.member_id, attd]))
    const activityRecords: MemberActivityRecord[] = []
    for(const { id } of appt.party_members){
        const hoursData = getHoursDataByMode(appt, mode, attendancesMap[id])
        if(!hoursData){
            continue
        }
        activityRecords.push({
            ...hoursData,
            appt_id: appt.id,
            label: appt.title,
            member_id: id,
        })
    }
    return activityRecords
}

function getHoursDataByMode(appt: AppointmentWithHoursContext, mode: DistributionMode, attd?: {
    check_in: Date | null,
    check_out: Date | null,
}){
    const hourStartAt = getDateTimeAsHours(appt.start_at) ?? 0
    const hourEndAt = getDateTimeAsHours(appt.end_at) ?? 0
    const hourCheckIn = getDateTimeAsHours(attd?.check_in)
    const hourCheckOut = getDateTimeAsHours(attd?.check_out)
    switch(mode){
        case "MARKED":
            if(!attd?.check_in && !attd?.check_out){
                return null
            }
        case "APPT_INTERVAL":
            return {
                hrs: Math.round(Math.floor((hourEndAt - hourStartAt)*10))/10,
                start_at: appt.start_at,
                end_at: appt.end_at,
            }
        case "CHECK":
            if(!hourCheckIn || !hourCheckOut || !attd?.check_in || !attd?.check_out){
                return null
            }
            return {
                hrs: Math.max(hourCheckOut - hourCheckIn, 0),
                start_at: attd.check_in,
                end_at: attd.check_out,
            }
        case "CHECK_IN":
            if(!hourCheckIn || !attd?.check_in){
                return null
            }
            return {
                hrs: Math.max(hourEndAt - hourCheckIn, 0),
                start_at: attd.check_in,
                end_at: appt.end_at,
            }
        case "CHECK_OUT":
            if(!hourCheckOut || !attd?.check_out){
                return null
            }
            return {
                hrs: Math.max(hourCheckOut, hourStartAt, 0),
                start_at: appt.start_at,
                end_at: attd.check_out,
            }
        default:
            throw "no mode specified"
    }
}

function getDateTimeAsHours(date: Date | null | undefined){
    return date? date.getTime()/3600000 : null
}