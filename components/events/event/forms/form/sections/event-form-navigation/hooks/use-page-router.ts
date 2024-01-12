"use client"

import type { FieldConfigProperty } from "@/server/classes/forms/fieldconfig"
import FieldConfig from "@/server/classes/forms/fieldconfig"
import { type Dispatch, type SetStateAction, useEffect } from "react"
import { DispatchEventForm } from "../../../handlers/event-form-manager"
import { usePathname, useRouter } from "next/navigation"

export default function usePageRouter(
    pageParams: number,
    currentPage: number,
    currentPageFields: FieldConfigProperty[],
    setInteract: Dispatch<SetStateAction<boolean>>,
    setHighlight: Dispatch<SetStateAction<string>>,
    dispatchEventForm: DispatchEventForm['dispatchEventForm']
){
    const router = useRouter()
    const pathname = usePathname()
    useEffect(() => {
        if(pageParams < 1){
            router.replace(pathname + '?page=1')
            return
        }
        const page = pageParams - 1
        if(page === currentPage){
            return
        }
        const responses: { [key: string]: string } = {}
        if(page > currentPage){
            for(const field of currentPageFields){
                const inputFieldId = (new FieldConfig(field)).getFieldId()
                const input = document.getElementById(inputFieldId) as HTMLInputElement
                const inputValidity = document.getElementById(`${inputFieldId}_VALIDITY`) as HTMLInputElement
                const rejectPdpa = field.field_type === 'PRIVACYPOLICY' && !input?.value.startsWith('true')
                if(inputValidity?.value === 'false' || rejectPdpa){
                    setHighlight(field.id)
                    setInteract(true)
                    router.back()
                    setTimeout(() => {
                        document.getElementById(`${field.id}_AUTOSCROLL`)?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                            inline: 'center'
                        })
                    },100)
                    return
                }
                responses[field.id] = input?.value ?? ''
            }
        } else {
            for(const field of currentPageFields){
                const inputFieldId = (new FieldConfig(field)).getFieldId()
                const input = document.getElementById(inputFieldId) as HTMLInputElement
                responses[field.id] = input?.value ?? ''
            }
        }
        setInteract(false)
        setHighlight('')
        dispatchEventForm({ type: 'edit_responses', responses })
        dispatchEventForm({ type: 'set_page', page })
        document.getElementById('form_top')?.scrollIntoView({ block: 'end' })
    }, [router, pathname, pageParams, currentPage, currentPageFields, setInteract, setHighlight, dispatchEventForm])
}