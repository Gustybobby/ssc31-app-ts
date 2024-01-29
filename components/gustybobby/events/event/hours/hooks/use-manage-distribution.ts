"use client"

import { useState } from "react"
import useHoursDistribution from "./use-hours-distribution"
import type { DistributionMode } from "@/server/modules/hours-modules"

export interface UseManageDistribution {
    eventId: string
    startAt: string
    endAt: string
}

export default function useManageDistribution({ eventId, startAt, endAt }: UseManageDistribution){

    const [mode, setMode] = useState<DistributionMode>('APPT_INTERVAL')
    const { distribution, refetch } = useHoursDistribution({ eventId, startAt, endAt, mode })

    return { distribution, refetch, mode, setMode }
}