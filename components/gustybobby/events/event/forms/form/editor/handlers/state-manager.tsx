"use client"

import { useReducer } from "react"
import formConfigReducer from "../hooks/form-config-reducer"
import FormConfig from "@/server/classes/forms/formconfig"
import ConfigFetcher from "./config-fetcher"

export default function StateManager({ newForm, eventId, formId, templateId }: {
    newForm: boolean, eventId: string, formId: string, templateId: string | null
}){

    const [formConfig, dispatchFormConfig] = useReducer(formConfigReducer, {
        ...FormConfig.defaultConfig(),
        form_fields: {},
        eventConfig: 'loading',
    })

    return(
        <ConfigFetcher
            newForm={newForm}
            eventId={eventId}
            formId={formId}
            templateId={templateId}
            formConfig={formConfig}
            dispatchFormConfig={dispatchFormConfig}
        />
    )
}