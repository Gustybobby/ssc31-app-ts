"use client"

import type { Dispatch, SetStateAction } from "react"
import type { DispatchEventForm } from "../../handlers/event-form-manager"
import type { EventForm } from "../../hooks/event-form-reducer"
import BackButton from "./back-button"
import ContinueButton from "./continue-button"
import SubmitButton from "./submit-button"
import type { FieldConfigProperty } from "@/server/classes/forms/fieldconfig"

interface EventFormNavigationProps extends DispatchEventForm{
    eventForm: EventForm
    setInteract: Dispatch<SetStateAction<boolean>>
    setHighlight: Dispatch<SetStateAction<string>>
}

export interface NavButtonProps extends DispatchEventForm {
    currentPageFields: FieldConfigProperty[]
    setInteract: Dispatch<SetStateAction<boolean>>
    setHighlight: Dispatch<SetStateAction<string>>
}

export default function EventFormNavigation({ eventForm, dispatchEventForm, setInteract, setHighlight }: EventFormNavigationProps){
    return(
        <div className="grid grid-cols-2">
            {eventForm.page > 0 &&
            <BackButton
                currentPageFields={eventForm.currentPageFields}
                dispatchEventForm={dispatchEventForm}
                setInteract={setInteract}
                setHighlight={setHighlight}
            />
            }
            <div className="col-start-2 flex justify-end">
                {eventForm.finished?
                <SubmitButton
                    eventForm={eventForm}
                    dispatchEventForm={dispatchEventForm}
                />
                :
                <ContinueButton
                    currentPageFields={eventForm.currentPageFields}
                    dispatchEventForm={dispatchEventForm}
                    setInteract={setInteract}
                    setHighlight={setHighlight}
                />
                }
            </div>
        </div>
    )
}