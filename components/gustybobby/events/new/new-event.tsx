"use client";

import { Toaster } from "react-hot-toast";
import NewEventComponent from "../_details/new/new-event-component";
import type { EventDataRequest } from "@/server/typeconfig/event";
import useEventDetails from "../_details/hooks/use-event-details";

export default function NewEvent(){

    const { eventDetails, dispatchEventDetails } = useEventDetails(defaultEventDetails)
    
    if(eventDetails === 'loading' || eventDetails === 'error'){
        return <></>
    }
    return(
        <>
            <div><Toaster/></div>
            <NewEventComponent
                eventDetails={eventDetails}
                dispatchEventDetails={dispatchEventDetails}
            />
        </>
    )
}

const defaultEventDetails: EventDataRequest = {
    title: 'Untitled Event',
    poster: null,
    description: '',
    positions: [],
    roles: [],
}
