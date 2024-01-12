"use client"

import type { EventConfigProperty } from "@/server/classes/eventconfig";
import type { DispatchEventForm } from "./event-form-manager";
import type { FormConfigProperty } from "@/server/classes/forms/formconfig";
import type { EventForm } from "../hooks/event-form-reducer";
import { ZoomIn } from "@/components/tools/transition";
import { Fragment } from "react";
import { eventStyles } from "@/components/styles/events";
import EventFormInfo from "../sections/event-form-info";
import EventFormInteractable from "../sections/event-form-interactable";

interface EventFormComponentProps extends DispatchEventForm{
    eventConfig: EventConfigProperty
    formConfig: FormConfigProperty
    eventForm: EventForm
}

export default function EventFormComponent({ eventConfig, formConfig, eventForm, dispatchEventForm }: EventFormComponentProps){
    return(
        <ZoomIn show={true} as={Fragment}>
            <div
                id="form_top"
                className={eventStyles.box({ size: 'md', round: true, extensions: 'my-4 p-2 space-y-2 -scroll-mb-32' })}
            >
                <EventFormInfo submitted={eventForm.submitted} formConfig={formConfig}/>
                {/*!eventForm.submitted*/}
                {false&&
                <EventFormInteractable
                    eventConfig={eventConfig}
                    eventForm={eventForm}
                    dispatchEventForm={dispatchEventForm}
                />
                }
            </div>
        </ZoomIn>
    )
}