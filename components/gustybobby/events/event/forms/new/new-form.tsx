"use client"

import { useSearchParams } from "next/navigation"
import StateManager from "../form/editor/handlers/state-manager"
import { Toaster } from "react-hot-toast"

export default function NewForm({ event_id, form_id }: { event_id: string, form_id: string }){

    const searchParams = useSearchParams()

    return(
        <>
            <div><Toaster/></div>
            <StateManager
                newForm={true}
                eventId={event_id}
                formId={form_id}
                templateId={searchParams.get('template_id')}
            />
        </>
    )
}