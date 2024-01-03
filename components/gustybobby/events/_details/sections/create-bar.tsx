"use client"

import { sectionStyles } from "@/components/styles/sections"
import { sendDataToAPI } from "@/components/tools/api"
import type { CreateEventResponse, EventDataRequest } from "@/server/typeconfig/event"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import checkFieldsValidity from "../hooks/check-fields-validity"

export default function CreateBar({ eventDetails }: { eventDetails: EventDataRequest }){

    const router = useRouter()

    return(
        <div className={createBarStyle}>
            <button
                className={sectionStyles.button({ color: 'green', large: true, hover: true, border: true })}
                onClick={async(e)=>{
                    const button = e.target as HTMLButtonElement
                    button.disabled = true
                    const createToast = toast.loading('Creating...')
                    try{
                        checkFieldsValidity(eventDetails.positions, eventDetails.roles, document)
                    } catch(error){
                        toast.error(String(error), { id: createToast })
                        button.disabled = false
                        return
                    }
                    const newEvent: CreateEventResponse = await sendDataToAPI({
                        apiUrl: '/api/gustybobby/events',
                        method: 'POST',
                        body: JSON.stringify({ data: eventDetails }),
                    })
                    switch(newEvent.message){
                        case 'SUCCESS':
                            toast.success('Created', { id: createToast })
                            router.push(`/gustybobby/events/${newEvent.data.id}/settings`)
                            break
                        case 'ERROR':
                            toast.error('Error', { id: createToast })
                            button.disabled = false
                    }
                }}
            >
                Create
            </button>
        </div>
    )
}

const createBarStyle = [
    'flex justify-start items-center',
    'm-2 p-2 rounded-lg shadow-lg',
    'bg-gray-100 dark:bg-transparent',
].join(' ')