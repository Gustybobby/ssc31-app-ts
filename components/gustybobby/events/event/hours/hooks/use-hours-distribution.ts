"use client"

import { hoursActivityUrl, type HoursActivityUrlProps } from "../urls";
import type { ActivityRecord } from "@/server/typeconfig/record";
import { useFetchData } from "@/components/tools/api";

export type HoursDistributionState = { [member_id: string]: ActivityRecord[] } | 'stasis' | 'loading' | 'error'

export default function useHoursDistribution({ eventId, startAt, endAt, memberId, positionId, roleId, mode }: HoursActivityUrlProps){
    const { data: distribution, setData: setDistribution, refetch } = useFetchData<HoursDistributionState>({
        apiUrl: hoursActivityUrl({ eventId, startAt, endAt, memberId, positionId, roleId, mode }),
        autoFetch: false,
        defaultState: 'stasis',
        waitingState: 'loading',
        badState: 'error',
        fetchOnInit: false,
    })
    return { distribution, setDistribution, refetch }
}