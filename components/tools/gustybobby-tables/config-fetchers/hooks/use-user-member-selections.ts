"use client"

import { useEffect, useState } from "react"
import { EventConfigState, type FormConfigState, type FormTableConfig, type SelectionResponsesState } from "../config-types"
import { memberSelectionsApiUrl } from "../config-urls"

export default function useUserMemberSelections({ eventId, formId, role }: FormTableConfig){
    const [eventConfig, setEventConfig] = useState<EventConfigState>('loading')
    const [formConfig, setFormConfig] = useState<FormConfigState>('loading')
    const [responses, setResponses] = useState<SelectionResponsesState>('loading')
    const [shouldRefetch, refetch] = useState({})

    useEffect(() => {
        fetch(memberSelectionsApiUrl({ eventId, formId, role }))
            .then((res) => res.ok? res.json() : { message: 'ERROR' })
            .then((data) => data.message === 'SUCCESS'? data.data : 'error')
            .then((data: any) => {
                if(data === 'error'){
                    setEventConfig('error')
                    setResponses('error')
                    setFormConfig('error')
                }
                setFormConfig(data.form_config)
                setResponses(data.responses)
                setEventConfig(data.eventConfig)
            })
    }, [eventId, formId, role, shouldRefetch])

    return { formConfig, responses, setResponses, eventConfig, refetch }
}