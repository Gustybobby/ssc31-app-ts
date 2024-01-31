"use client"

import type { FormCardConfig } from "../sections/form-cards-types"
import { useFetchData } from "@/components/tools/api"

export default function useEventForms(event_id: string){
    const { data: eventForms, setData: setEventForms, refetch } = useFetchData<FormCardConfig[]|'loading'|'error'>({
        apiUrl: `/api/gustybobby/events/${event_id}/forms?count_res=1&id=1&title=1&type=1&open=1&updated_at=1`,
        autoFetch: false,
        defaultState: 'loading',
        waitingState: 'loading',
        badState: 'error'
    })
    return { eventForms, setEventForms, refetch }
}