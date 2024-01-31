"use client"

import type { FormConfigState, FormTableConfig } from "../config-types"
import { formApiUrl } from "../config-urls"
import { useFetchData } from "@/components/tools/api"

export default function useFormConfig({ eventId, formId, role }: FormTableConfig){
    const { data: formConfig, setData: setFormConfig, refetch } = useFetchData<FormConfigState>({
        apiUrl: formApiUrl({ eventId, formId, role }),
        autoFetch: true,
        defaultState: 'loading',
        waitingState: 'loading',
        badState: 'error',
    })
    return { formConfig, setFormConfig, refetch }
}