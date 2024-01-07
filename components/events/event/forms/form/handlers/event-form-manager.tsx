"use client"

import { type Dispatch, useReducer } from "react"
import eventFormReducer, { type EventFormReducerAction } from "../hooks/event-form-reducer"
import type { EventConfigProperty } from "@/server/classes/eventconfig"
import type { FormConfigProperty } from "@/server/classes/forms/formconfig"
import FormPagination from "@/server/classes/forms/formpagination"
import EventFormComponent from "./event-form-component"

export interface DispatchEventForm {
    dispatchEventForm: Dispatch<EventFormReducerAction>
}

export default function EventFormManager({ event_config, form_config, submitted
}: { event_config: EventConfigProperty, form_config: FormConfigProperty, submitted: boolean }){

    const [eventForm, dispatchEventForm] = useReducer(eventFormReducer, initialEventForm(event_config, form_config, submitted))

    return (
        <EventFormComponent
            eventConfig={event_config}
            formConfig={form_config}
            eventForm={eventForm}
            dispatchEventForm={dispatchEventForm}
        />
    )
}

function initialEventForm(eventConfig: EventConfigProperty, formConfig: FormConfigProperty, submitted: boolean){
    const formPagination = FormPagination.initialize({
        field_order: formConfig.field_order ?? [],
        form_fields: formConfig.form_fields ?? {},
        eventConfig,
        responses: {},
        page: 0,
    })
    const currentPageFields = formPagination.getCurrentPageFields()
    return { ...formPagination, form_id: formConfig.id ?? '', currentPageFields, submitted, finished: false }
}