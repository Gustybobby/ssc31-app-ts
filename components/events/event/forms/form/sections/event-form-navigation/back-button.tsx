"use client"

import { sectionStyles } from "@/components/styles/sections"
import FieldConfig from "@/server/classes/forms/fieldconfig"
import type { NavButtonProps } from "./event-form-navigation"

export default function BackButton({ currentPageFields, dispatchEventForm, setInteract, setHighlight }: NavButtonProps){
    return(
        <button
            className={sectionStyles.button({ color: 'blue', hover: true, border: true })}
            onClick={() => {
                const responses: { [key: string]: string } = {}
                for(const field of currentPageFields){
                    const inputFieldId = (new FieldConfig(field)).getFieldId()
                    const input = document.getElementById(inputFieldId) as HTMLInputElement
                    responses[field.id] = input?.value ?? ''
                }
                setInteract(false)
                setHighlight('')
                dispatchEventForm({ type: 'edit_responses', responses })
                dispatchEventForm({ type: 'prev_page' })
            }}
        >
            Back
        </button>
    )
}