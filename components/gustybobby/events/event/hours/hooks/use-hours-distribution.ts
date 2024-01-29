"use client"

import { useEffect, useRef, useState } from "react";
import { hoursActivityUrl, type HoursActivityUrlProps } from "../urls";
import type { ActivityRecord } from "@/server/typeconfig/record";

export type HoursDistributionState = { [member_id: string]: ActivityRecord[] } | 'stasis' | 'loading' | 'error'

export default function useHoursDistribution({ eventId, startAt, endAt, memberId, positionId, roleId, mode }: HoursActivityUrlProps){
    const [distribution, setDistribution] = useState<HoursDistributionState>('stasis')
    const [shouldRefetch, refetch] = useState({})
    const refetchRef = useRef<{}>(shouldRefetch)
    
    useEffect(() => {
        if(refetchRef.current === shouldRefetch || !(startAt && endAt)){
            return
        }
        setDistribution('loading')
        refetchRef.current = shouldRefetch
        fetch(hoursActivityUrl({ eventId, startAt, endAt, memberId, positionId, roleId, mode }))
            .then(res => res.ok? res.json() : { message: 'ERROR' })
            .then(data => data.message === 'SUCCESS'? data.data : 'error')
            .then(data => setDistribution(data))
    },[eventId, startAt, endAt, memberId, positionId, roleId, mode, shouldRefetch])

    return { distribution, setDistribution, refetch }
}