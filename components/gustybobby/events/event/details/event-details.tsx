"use client"

import { useEffect, useReducer, useState } from "react"
import EditEventComponent from "../../_details/edit/edit-event-component"
import DashboardWrapper from "../dashboard-wrapper"
import eventDetailsReducer from "../../_details/hooks/event-details-reducer"
import FetchingSVG from "@/components/svg/fetching-svg"
import { ErrorComponent } from "@/app/not-found"

export default function EventDetails({ event_id, event_title }: { event_id: string, event_title: string }){
    
    const [eventDetails, dispatchEventDetails] = useReducer(eventDetailsReducer, 'loading')
    const [refetch, setRefetch] = useState(false)

    useEffect(() => {
        if(refetch === null){
            return
        }
        fetch(`/api/gustybobby/events/${event_id}/details`)
            .then(res => res.ok? res.json() : { message: 'ERROR' })
            .then(data => data.message === 'SUCCESS'? data.data : 'error')
            .then(data => dispatchEventDetails({ type: 'set', state: data }))
    }, [event_id, refetch])

    if(eventDetails === 'loading'){
        return(
            <DashboardWrapper eventId={event_id} eventTitle={event_title}>
                <div className="p-4 flex flex-col items-center justify-center space-y-4">
                    <FetchingSVG/>
                </div>
            </DashboardWrapper>
        )
    }
    if(eventDetails === 'error'){
        return (
            <DashboardWrapper eventId={event_id} eventTitle={event_title}>
                <div className="h-[75vh] flex justify-center items-center"><ErrorComponent/></div>
            </DashboardWrapper>
        )
    }
    return(
        <DashboardWrapper eventId={event_id} eventTitle={event_title}>
            <EditEventComponent
                eventDetails={eventDetails}
                dispatchEventDetails={dispatchEventDetails}
                setRefetch={setRefetch}
            />
        </DashboardWrapper>
    )
}