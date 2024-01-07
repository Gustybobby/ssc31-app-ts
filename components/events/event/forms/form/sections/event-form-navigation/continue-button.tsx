"use client"

import { sectionStyles } from "@/components/styles/sections"
import FieldConfig from "@/server/classes/forms/fieldconfig"
import { NavButtonProps } from "./event-form-navigation"

export default function ContinueButton({ currentPageFields, dispatchEventForm, setInteract, setHighlight }: NavButtonProps){
    return(
        <button
            className={sectionStyles.button({ color: 'blue', hover: true, border: true })}
            onClick={() => {
                const responses: { [key: string]: string } = {}
                for(const field of currentPageFields){
                    const inputFieldId = (new FieldConfig(field)).getFieldId()
                    const input = document.getElementById(inputFieldId) as HTMLInputElement
                    const inputValidity = document.getElementById(`${inputFieldId}_VALIDITY`) as HTMLInputElement
                    const rejectPdpa = field.field_type === 'PRIVACYPOLICY' && !input?.value.startsWith('true')
                    if(inputValidity?.value === 'false' || rejectPdpa){
                        setHighlight(field.id)
                        setInteract(true)
                        document.getElementById(`${field.id}_AUTOSCROLL`)?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                            inline: 'center'
                        })
                        return
                    }
                    responses[field.id] = input?.value ?? ''
                }
                setInteract(false)
                setHighlight('')
                dispatchEventForm({ type: 'edit_responses', responses })
                dispatchEventForm({ type: 'next_page' })
            }}
        >
            Continue
        </button>
    )
}