"use client"

import StateManager from "./handlers/state-manager"

export default function FormEditor({ event_id, form_id }: { event_id: string, form_id: string }){
    return(
        <StateManager
            newForm={false}
            eventId={event_id}
            formId={form_id}
            templateId={null}
        />
    )
}