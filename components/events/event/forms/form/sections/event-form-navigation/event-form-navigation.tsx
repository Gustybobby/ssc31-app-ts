"use client"

import { useEffect, type Dispatch, type SetStateAction } from "react"
import type { DispatchEventForm } from "../../handlers/event-form-manager"
import type { EventForm } from "../../hooks/event-form-reducer"
import BackButton from "./back-button"
import ContinueButton from "./continue-button"
import SubmitButton from "./submit-button"
import type { FieldConfigProperty } from "@/server/classes/forms/fieldconfig"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
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

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const pageParams = Number(searchParams.get('page') ?? 1)
    usePageRouter(pageParams, eventForm.page, eventForm.currentPageFields, setInteract, setHighlight, dispatchEventForm)
    useEffect(() => {
        if(eventForm.currentPageFields.length === 0 && pageParams-1 === eventForm.page && !eventForm.finished){
            router.replace(pathname+'?page='+String(pageParams+1))
        }
    }, [eventForm, pageParams, pathname, router])

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