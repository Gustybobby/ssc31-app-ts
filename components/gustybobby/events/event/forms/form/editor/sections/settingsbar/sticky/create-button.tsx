"use client"

import { sectionStyles } from "@/components/styles/sections"
import { useRouter } from "next/navigation"
import { sendDataToAPI } from "@/components/tools/api"
import toast from "react-hot-toast"
import type { FormConfigProperty } from "@/server/classes/forms/formconfig"
import FormConfig from "@/server/classes/forms/formconfig"

interface CreateButtonProps {
    eventId: string
    formConfig: FormConfigProperty
}

export default function CreateButton({ eventId, formConfig }: CreateButtonProps){

    const router = useRouter()

    return(
        <div className="flex justify-start order-4 md:order-1">
            <button 
                className={sectionStyles.button({ color: 'green', hover: true, border: true })} 
                onClick={async(e) => {
                    const button = e.target as HTMLButtonElement
                    button.disabled = true
                    const createToast = toast.loading('Creating...')
                    try{
                        (new FormConfig(formConfig)).validateFormFields()
                    } catch(e: any){
                        toast.error(`Error, ${e.exception}`, { id: createToast })
                        button.disabled = false
                        document.getElementById(`EDITOR_FIELD_${e.field_id}`)?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                            inline: 'center'
                        })
                        return
                    }
                    const res = await sendDataToAPI({
                        apiUrl: `/api/gustybobby/events/${eventId}/forms`,
                        method: 'POST',
                        body: JSON.stringify({ data: FormConfig.clone(formConfig) })
                    })
                    switch(res?.message){
                        case 'SUCCESS':
                            router.push(`/gustybobby/events/${eventId}/forms/${res.data.form_id}/editor`)
                            toast.success('Created', { id: createToast })
                            break
                        case 'ERROR':
                        case undefined:
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