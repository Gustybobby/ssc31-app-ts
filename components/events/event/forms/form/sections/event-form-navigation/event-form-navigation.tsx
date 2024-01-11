"use client"

import { type Dispatch, type SetStateAction } from "react"
import type { DispatchEventForm } from "../../handlers/event-form-manager"
import type { EventForm } from "../../hooks/event-form-reducer"
import BackButton from "./back-button"
import ContinueButton from "./continue-button"
import SubmitButton from "./submit-button"
import type { FieldConfigProperty } from "@/server/classes/forms/fieldconfig"
import { useSearchParams } from "next/navigation"
import usePageRouter from "./hooks/use-page-router"

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

    const searchParams = useSearchParams()
    const pageParams = Number(searchParams.get('page'))
    usePageRouter(pageParams, eventForm.page, eventForm.currentPageFields, setInteract, setHighlight, dispatchEventForm)

    return(
        <div className="grid grid-cols-2">
            {eventForm.page > 0 &&
            <BackButton/>
            }
            <div className="col-start-2 flex justify-end">
                {eventForm.finished?
                <SubmitButton
                    eventForm={eventForm}
                    dispatchEventForm={dispatchEventForm}
                />
                :
                <ContinueButton/>
                }
            </div>
        </div>
    )
}