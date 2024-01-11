"use client"

import EditEventComponent from "../../_details/edit/edit-event-component"
import DashboardWrapper from "../dashboard-wrapper"
import FetchingSVG from "@/components/svg/fetching-svg"
import useEventDetails from "../../_details/hooks/use-event-details"

export default function EventDetails({ event_id, event_title }: { event_id: string, event_title: string }){
    
    const { eventDetails, dispatchEventDetails, refetch } = useEventDetails('loading', event_id)

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
        throw 'fetch event details error'
    }
    return(
        <DashboardWrapper eventId={event_id} eventTitle={event_title}>
            <EditEventComponent
                eventDetails={eventDetails}
                dispatchEventDetails={dispatchEventDetails}
                refetch={refetch}
            />
        </DashboardWrapper>
    )
}