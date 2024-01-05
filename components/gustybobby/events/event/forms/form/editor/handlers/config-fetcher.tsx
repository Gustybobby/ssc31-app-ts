"use client"

import type { OptionalEventForm } from "@/server/classes/forms/formconfig"
import type { DispatchFormConfig } from "./state-manager"
import { useEffect, useState } from "react"
import FormTemplate from "@/server/classes/forms/formtemplate"
import FetchingSVG from "@/components/svg/fetching-svg"
import { ErrorComponent } from "@/app/not-found"
import EditorComponent from "./editor-component"
import type { EditorFormConfig } from "../hooks/form-config-reducer"
import FormConfig from "@/server/classes/forms/formconfig"

const eventApiUrl = (eventId: string) => (`/api/gustybobby/events/${eventId}?id=1&positions=1&roles=1`)
const templateApiUrl = (templateId: string) => (`/api/gustybobby/form-templates/${templateId}`)
const formApiUrl = (eventId: string, formId: string) => (`/api/gustybobby/events/${eventId}/forms/${formId}`)

interface ConfigFetcherProps extends DispatchFormConfig{
    newForm: boolean
    eventId: string
    formId: string
    templateId: string | null
    formConfig: EditorFormConfig
}

export default function ConfigFetcher({ newForm, eventId, formId, templateId, formConfig, dispatchFormConfig }: ConfigFetcherProps){

    const [refetch, setRefetch] = useState(false)
    const [status, setStatus] = useState<'success'|'loading'|'error'>('loading')

    useEffect(() => {
        fetch(eventApiUrl(eventId))
            .then(res => res.ok? res.json() : { message: 'ERROR' })
            .then(data => data.message === 'SUCCESS'? data.data : 'error')
            .then(eventConfig => {
                if(eventConfig === 'error'){
                    setStatus('error')
                    return
                }
                if(newForm && !templateId){
                    dispatchFormConfig({ type: 'set_event_config', eventConfig })
                    setStatus('success')
                    return 'done'
                }
                if(newForm && templateId){
                    fetch(templateApiUrl(templateId))
                        .then(res => res.ok? res.json() : { message: 'ERROR' })
                        .then(data => data.message === 'SUCCESS'? data.data : 'error')
                        .then(data => {
                            if(data === 'error'){
                                setStatus('error')
                            } else {
                                const template = (new FormTemplate(data)).getFormFieldsAndOrder()
                                dispatchFormConfig({ type: 'set_template', template, eventConfig })
                                setStatus('success')
                            }
                        })
                    return
                }
                if(!newForm){
                    fetch(formApiUrl(eventId, formId))
                        .then(res => res.ok? res.json() : { message: 'ERROR' })
                        .then(data => data.message === 'SUCCESS'? data.data : 'error')
                        .then((data: OptionalEventForm | 'error') => {
                            if(data === 'error'){
                                setStatus('error')
                            } else {
                                dispatchFormConfig({
                                    type: 'set_config',
                                    config: FormConfig.fromDatabase(data),
                                    eventConfig
                                })
                                setStatus('success')
                            }
                        })
                    return
                }
            })
    }, [newForm, eventId, formId, templateId, refetch, dispatchFormConfig])

    if(status === 'loading'){
        return (
            <div className="flex justify-center">
                <FetchingSVG/>
            </div>
        )
    }
    if(status === 'error'){
        return (
            <div className="w-full h-[80vh] flex justify-center items-center">
                <ErrorComponent/>
            </div>
        )
    }
    return(
        <EditorComponent
            formConfig={formConfig}
            dispatchFormConfig={dispatchFormConfig}
            setRefetch={setRefetch}
        />
    )
}