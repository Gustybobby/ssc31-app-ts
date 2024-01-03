"use client"

import { sectionStyles } from "@/components/styles/sections"
import type { EventDataRequest, EventDefaultResponse } from "@/server/typeconfig/event"
import type { Dispatch, SetStateAction } from "react"
import checkFieldsValidity from "../hooks/check-fields-validity"
import toast from "react-hot-toast"
import { sendDataToAPI } from "@/components/tools/api"

export default function SaveBar({eventDetails, setRefetch
}: {
    eventDetails: EventDataRequest,
    setRefetch: Dispatch<SetStateAction<boolean>>
}){
    return(
        <div className={saveBarStyle}>
            <button
                className={sectionStyles.button({ color: 'blue', large: true, hover: true, border: true })}
                onClick={async(e)=>{
                    const button = e.target as HTMLButtonElement
                    button.disabled = true
                    const saveToast = toast.loading('Saving...')
                    try{
                        checkFieldsValidity(eventDetails.positions, eventDetails.roles, document)
                    } catch(error){
                        toast.error(String(error), { id: saveToast })
                        button.disabled = false
                        return
                    }
                    const res: EventDefaultResponse = await sendDataToAPI({
                        apiUrl: `/api/gustybobby/events/${eventDetails.id}/details`,
                        method: 'PUT',
                        body: JSON.stringify({ data: eventDetails }),
                    })
                    switch(res.message){
                        case 'SUCCESS':
                            toast.success('Saved', { id: saveToast })
                            setRefetch(refetch => !refetch)
                            break   
                        case 'ERROR':
                            toast.error('Error', { id: saveToast })
                    }
                    button.disabled = false
                }}
            >
                Save
            </button>
            <div className="font-medium px-4 md:px-0">
                Last Updated:{' '}
                <span className="inline-block text-green-500">
                    {(new Date(eventDetails?.updated_at ?? '')).toLocaleString()}
                </span>
            </div>
        </div>
    )
}

const saveBarStyle = [
    'flex justify-between items-center',
    'm-2 p-2 rounded-lg shadow-lg',
    'bg-gray-100 dark:bg-transparent',
].join(' ')