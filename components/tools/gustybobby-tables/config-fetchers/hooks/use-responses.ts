"use client"

import { useEffect, useState } from "react"
import type { FormTableConfig, ResponsesState } from "../config-types"
import { formResponseApiUrl } from "../config-urls"

export default function useResponses({ eventId, formId, role }: FormTableConfig){
    const [responses, setResponses] = useState<ResponsesState>('loading')
    useEffect(() => {
        setResponses('loading')
        fetch(formResponseApiUrl({ eventId, formId, role }))
            .then(res => res.ok? res.json() : { message: 'ERROR' })
            .then(data => data.message === 'SUCCESS'? data.data : 'error')
            .then(data => setResponses(data))
    }, [eventId, formId, role])
    return responses
}