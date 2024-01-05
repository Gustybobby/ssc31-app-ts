import { sectionStyles } from "@/components/styles/sections"
import { sendDataToAPI } from "@/components/tools/api"
import type { FieldConfigProperty } from "@/server/classes/forms/fieldconfig"
import FormConfig from "@/server/classes/forms/formconfig"
import type { EventDefaultResponse } from "@/server/typeconfig/event"
import toast from "react-hot-toast"

interface TemplateThisButtonProps {
    formFields: { [key: string]: FieldConfigProperty }
    fieldOrder: string[]
}

export default function TemplateThisButton({ formFields, fieldOrder }: TemplateThisButtonProps){
    return(
        <div className="flex justify-end items-start md:col-start-5 order-2 md:order-4">
            <button 
                className={sectionStyles.button({ color: 'blue', hover: true, border: true })} 
                onClick={async(e) => {
                    const button = e.target as HTMLButtonElement
                    button.disabled = true
                    const templateToast = toast.loading('Templating...')
                    const formConfig = new FormConfig({ form_fields: formFields, field_order: fieldOrder })
                    const res: EventDefaultResponse = await sendDataToAPI({
                        apiUrl: `/api/gustybobby/form-templates`,
                        method: 'POST',
                        body: JSON.stringify({ data: formConfig.getFormFieldsAsArray() }),
                    })
                    switch(res.message){
                        case 'SUCCESS':
                            toast.success('Templated', { id: templateToast })
                            break
                        case 'ERROR':
                            toast.error('Error', { id: templateToast })
                    }
                    button.disabled = false
                }}
            >
                Template this
            </button>
        </div>
    )
}