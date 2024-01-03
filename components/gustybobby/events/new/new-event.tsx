"use client";
import { useReducer } from "react";
import { Toaster } from "react-hot-toast";
import eventDetailsReducer from "../_details/hooks/event-details-reducer";
import NewEventComponent from "../_details/new/new-event-component";
import type { EventDataRequest } from "@/server/typeconfig/event";

export default function NewEvent(){

    const [eventDetails, dispatchEventDetails] = useReducer(eventDetailsReducer, defaultEventDetails)
    
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
