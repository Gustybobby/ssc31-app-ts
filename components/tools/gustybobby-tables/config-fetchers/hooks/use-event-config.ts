"use client"

import type { EventConfigState, EventTableConfig } from "../config-types"
import { eventApiUrl } from "../config-urls"
import { useFetchData } from "@/components/tools/api"

export default function useEventConfig({ eventId, role }: EventTableConfig){
    const { data: eventConfig, setData: setEventConfig, refetch } = useFetchData<EventConfigState>({
        apiUrl: eventApiUrl({ eventId, role }),
        autoFetch: false,
        defaultState: 'loading',
        waitingState: 'loading',
        badState: 'error',
    })
    return { eventConfig, setEventConfig, refetch }
}