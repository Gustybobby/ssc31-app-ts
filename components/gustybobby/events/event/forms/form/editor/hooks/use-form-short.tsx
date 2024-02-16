"use client"

import { useFetchData } from "@/components/tools/api"

interface UseFormShortProps {
    eventId: string
    formId: string
}

export default function useFormShort({ eventId, formId }: UseFormShortProps){
    const { data: formShort, refetch } = useFetchData<{ id: string, form_id: string } | null | 'loading'>({
        apiUrl: `/api/gustybobby/events/${eventId}/forms/${formId}?form_short=1`,
        defaultState: 'loading',
        waitingState: 'loading',
        badState: null,
        autoFetch: false,
        accessor: 'form_short',
    })
    return { formShort, refetch }
}