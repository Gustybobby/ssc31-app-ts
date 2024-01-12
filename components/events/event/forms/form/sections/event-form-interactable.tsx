"use client"

import { useState } from "react"
import EventFormFields from "./event-form-fields"
import type { DispatchEventForm } from "../handlers/event-form-manager"
import type { EventConfigProperty } from "@/server/classes/eventconfig"
import type { EventForm } from "../hooks/event-form-reducer"
import EventFormNavigation from "./event-form-navigation/event-form-navigation"

interface EventFormInteractableProps extends DispatchEventForm{
    eventConfig: EventConfigProperty
    eventForm: EventForm
}

export default function EventFormInteractable({ eventConfig, eventForm, dispatchEventForm }: EventFormInteractableProps){
    
    const [interact, setInteract] = useState(false)
    const [highlight, setHighlight] = useState('')

    return(
        <div className="flex flex-col w-full space-y-4">
            <EventFormFields
                finished={eventForm.finished}
                currentPageFields={eventForm.currentPageFields}
                eventConfig={eventConfig}
                interact={interact}
                highlight={highlight}
                setHighlight={setHighlight}
            />
            {/*
            <EventFormNavigation
                eventForm={eventForm}
                dispatchEventForm={dispatchEventForm}
                setInteract={setInteract}
                setHighlight={setHighlight}
            />
            */}
        </div>
    )
}