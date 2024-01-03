"use client"

import { sectionStyles } from "@/components/styles/sections"
import DashboardWrapper from "../dashboard-wrapper"
import FormCardsSection, { FormCardConfig } from "./sections/formcards/form-cards-section"
import { useEffect, useState } from "react"
import FetchingSVG from "@/components/svg/fetching-svg"
import { ErrorComponent } from "@/app/not-found"
import DeleteFormsSection from "./sections/deleteforms/delete-forms-section"

export default function EventForms({ event_id, event_title }: { event_id: string, event_title: string }){

    const [eventForms, setEventForms] = useState<FormCardConfig[]|'loading'|'error'>('loading')
    const [refetch, setRefetch] = useState(false)

    useEffect(() => {
        if(refetch === null){
            return
        }
        fetch(`/api/gustybobby/events/${event_id}/forms?count_res=1&id=1&title=1&type=1&open=1&updated_at=1`)
            .then(res => res.ok? res.json() : { message: 'ERROR' })
            .then(data => data.message === 'SUCCESS'? data.data : 'error')
            .then(data => setEventForms(data))
    }, [event_id, refetch])

    if(eventForms === 'error'){
        return <ErrorComponent/>
    }
    return(
        <DashboardWrapper eventId={event_id} eventTitle={event_title}>
            <div className={sectionStyles.container()}>
                {eventForms === 'loading'?
                <div className="p-4 flex flex-col items-center justify-center space-y-4">
                    <FetchingSVG/>
                </div>
                :
                <>
                    <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                        <div className={sectionStyles.title({ color: 'purple', extensions: 'mb-2' })}>
                            Forms
                        </div>
                        <FormCardsSection
                            eventId={event_id}
                            eventForms={eventForms}
                            setRefetch={setRefetch}
                        />
                    </div>
                    <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                        <div className={sectionStyles.title({ color: 'red' })}>
                            Delete
                        </div>
                        <DeleteFormsSection
                            eventId={event_id}
                            eventForms={eventForms}
                            setRefetch={setRefetch}
                        />
                    </div>
                </>
                }
            </div>
        </DashboardWrapper>
    )
}