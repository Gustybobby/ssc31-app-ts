"use client"

import { sectionStyles } from "@/components/styles/sections"
import type { DispatchEventForm } from "../../handlers/event-form-manager"
import { sendDataToAPI } from "@/components/tools/api"
import type { EventForm } from "../../hooks/event-form-reducer"
import { useState } from "react"
import LoadingSVG from "@/components/svg/loading-svg"

const formApiUrl = (eventId: string, formId: string) => (`/api/user/events/${eventId}/forms/${formId}/responses`)

interface SubmitButtonProps extends DispatchEventForm {
    eventForm: EventForm
}

export default function SubmitButton({ eventForm, dispatchEventForm }: SubmitButtonProps){

    const [loading, setLoading] = useState(false)

    return(
        <button
            className={sectionStyles.button({ color: 'blue', hover: true, border: true })}
            onClick={async(e) => {
                setLoading(true)
                const button = e.target as HTMLButtonElement
                button.disabled = true
                const res = await sendDataToAPI({
                    apiUrl: formApiUrl(eventForm.eventConfig.id, eventForm.form_id),
                    method: 'POST',
                    body: JSON.stringify({ data: eventForm.responses })
                })
                switch(res.message){
                    case 'SUCCESS':
                        dispatchEventForm({ type: 'set_submitted' })
                        break
                    case 'ERROR':
                        button.disabled = false
                        setLoading(false)
                }
            }}
        >
            {loading && <LoadingSVG fillColor="fill-green-400"/>}
            <span className="">Submit</span>
        </button>
    )
}