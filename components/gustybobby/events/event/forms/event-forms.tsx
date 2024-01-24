"use client"

import { sectionStyles } from "@/components/styles/sections"
import FormCardsSection from "./sections/formcards/form-cards-section"
import DeleteFormsSection from "./sections/deleteforms/delete-forms-section"
import EventFormsLoading from "./sections/event-forms-loading"
import useEventForms from "./hooks/use-event-forms"

export default function EventForms({ event_id }: { event_id: string }){

    const { eventForms, refetch } = useEventForms(event_id)

    if(eventForms === 'error'){
        throw 'fetch event forms error'
    }
    if(eventForms === 'loading'){
        return <EventFormsLoading/>
    }
    return(
        <div className={sectionStyles.container()}>
            <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                <div className={sectionStyles.title({ color: 'purple', extensions: 'mb-2' })}>
                    Forms
                </div>
                <FormCardsSection
                    eventId={event_id}
                    eventForms={eventForms}
                    refetch={refetch}
                />
            </div>
            <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                <div className={sectionStyles.title({ color: 'red' })}>
                    Delete
                </div>
                <DeleteFormsSection
                    eventId={event_id}
                    eventForms={eventForms}
                    refetch={refetch}
                />
            </div>
        </div>
    )
}