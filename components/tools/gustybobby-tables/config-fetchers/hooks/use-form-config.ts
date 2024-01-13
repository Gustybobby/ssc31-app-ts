"use client"

import { useEffect, useState } from "react"
import type { FormConfigState, FormTableConfig } from "../config-types"
import { formApiUrl } from "../config-urls"

export default function useFormConfig({ eventId, formId, role }: FormTableConfig){
    const [formConfig, setFormConfig] = useState<FormConfigState>('loading')
    const [shouldRefetch, refetch] = useState({})
    useEffect(() => {
        setFormConfig('loading')
        fetch(formApiUrl({ eventId, formId, role }))
            .then(res => res.ok? res.json() : { message: 'ERROR' })
            .then(data => data.message === 'SUCCESS'? data.data : 'error')
            .then(data => setFormConfig(data))
    }, [eventId, formId, role, shouldRefetch])
    return { formConfig, refetch }
}