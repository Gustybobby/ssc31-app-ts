"use client"

import EditEventComponent from "../../_details/edit/edit-event-component"
import FetchingSVG from "@/components/svg/fetching-svg"
import useEventDetails from "../../_details/hooks/use-event-details"

export default function EventDetails({ event_id }: { event_id: string }){
    
    const { eventDetails, dispatchEventDetails, refetch } = useEventDetails('loading', event_id)

    if(eventDetails === 'loading'){
        return(
            <div className="p-4 flex flex-col items-center justify-center space-y-4">
                <FetchingSVG/>
            </div>
        )
    }
    if(eventDetails === 'error'){
        throw 'fetch event details error'
    }
    return(
        <EditEventComponent
            eventDetails={eventDetails}
            dispatchEventDetails={dispatchEventDetails}
            refetch={refetch}
        />
    )
}