"use client"

import { sectionStyles } from "@/components/styles/sections"
import { sendDataToAPI } from "@/components/tools/api"
import type { EventDefaultResponse } from "@/server/typeconfig/event"
import type { Dispatch, SetStateAction } from "react"
import toast from "react-hot-toast"

export default function DeleteButton({ eventId, formId, canDelete, setRefetch }: {
    eventId: string, formId: string, canDelete: boolean, setRefetch: Dispatch<SetStateAction<boolean>>
}){
    return(
        <button 
            className={sectionStyles.button({ color: canDelete? 'red': 'gray', hover: canDelete, border: true })}
            disabled={!canDelete}
            onClick={async() => {
                const deleteToast = toast.loading('Deleting...')
                const res: EventDefaultResponse = await sendDataToAPI({
                    apiUrl: `/api/gustybobby/events/${eventId}/forms/${formId}`,
                    method: 'DELETE',
                })
                switch(res.message){
                    case "SUCCESS":
                        toast.success('Deleted', { id: deleteToast })
                        setRefetch(refetch => !refetch)
                        break
                    default:
                        toast.error('Error', { id: deleteToast })
                }
            }}
        >
            Delete
        </button>
    )
}