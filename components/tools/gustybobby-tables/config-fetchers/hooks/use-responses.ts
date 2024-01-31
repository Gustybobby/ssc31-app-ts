"use client"

import type { FormTableConfig, ResponsesState } from "../config-types"
import { formResponseApiUrl } from "../config-urls"
import { useFetchData } from "@/components/tools/api"

export default function useResponses({ eventId, formId, role }: FormTableConfig){
    const { data: responses, setData: setResponses, refetch } = useFetchData<ResponsesState>({
        apiUrl: formResponseApiUrl({ eventId, formId, role }),
        autoFetch: true,
        defaultState: 'loading',
        waitingState: 'loading',
        badState: 'error',
    })
    return { responses, setResponses, refetch }
}