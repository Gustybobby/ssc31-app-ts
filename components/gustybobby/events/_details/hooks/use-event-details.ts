"use client"

import type { EventDataRequest } from "@/server/typeconfig/event";
import { useEffect, useReducer, useState } from "react";
import eventDetailsReducer from "./event-details-reducer";

export default function useEventDetails(defaultEventDetails: EventDataRequest | 'loading' | 'error', event_id?: string){
    const [eventDetails, dispatchEventDetails] = useReducer(eventDetailsReducer, defaultEventDetails)
    const [shouldRefetch, refetch] = useState({})
    useEffect(() => {
        if(!event_id){
            return
        }
        fetch(`/api/gustybobby/events/${event_id}/details`)
            .then(res => res.ok? res.json() : { message: 'ERROR' })
            .then(data => data.message === 'SUCCESS'? data.data : 'error')
            .then(data => dispatchEventDetails({ type: 'set', state: data }))
    }, [event_id, shouldRefetch])
    return { eventDetails, dispatchEventDetails, refetch }
}