"use client"

import { sectionStyles } from "@/components/styles/sections"
import { sendDataToAPI } from "@/components/tools/api"
import toast from "react-hot-toast"
import type { FormConfigProperty } from "@/server/classes/forms/formconfig"
import FormConfig from "@/server/classes/forms/formconfig"
import type { Dispatch, SetStateAction } from "react"

interface SaveButtonProps {
    eventId: string
    formConfig: FormConfigProperty
    setRefetch: Dispatch<SetStateAction<boolean>> 
}

export default function SaveButton({ eventId, formConfig, setRefetch }: SaveButtonProps){
    return(
        <div className="flex justify-start order-4 md:order-1">
            <button 
                className={sectionStyles.button({ color: 'blue', hover: true, border: true })} 
                onClick={async(e) => {
                    const button = e.target as HTMLButtonElement
                    button.disabled = true
                    const saveToast = toast.loading('Saving...')
                    try{
                        (new FormConfig(formConfig)).validateFormFields()
                    } catch(e: any){
                        toast.error(`Error, ${e.exception}`, { id: saveToast })
                        button.disabled = false
                        document.getElementById(`EDITOR_FIELD_${e.field_id}`)?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                            inline: 'center'
                        })
                        return
                    }
                    const res = await sendDataToAPI({
                        apiUrl: `/api/gustybobby/events/${eventId}/forms/${formConfig.id}`,
                        method: 'PUT',
                        body: JSON.stringify({ data: FormConfig.clone(formConfig) })
                    })
                    switch(res?.message){
                        case 'SUCCESS':
                            toast.success('Saved', { id: saveToast })
                            break
                        case 'ERROR':
                        case undefined:
                            toast.error('Error', { id: saveToast })
                    }
                    button.disabled = false
                    setRefetch(refetch => !refetch)
                }}
            >
                Save
            </button>
        </div>
    )
}