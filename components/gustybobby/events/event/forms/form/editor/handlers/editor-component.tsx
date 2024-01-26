"use client"

import { type Dispatch, type SetStateAction, useState } from "react"
import type { EditorFormConfig } from "../hooks/form-config-reducer"
import type { DispatchFormConfig } from "../editor-types"
import { Toaster } from "react-hot-toast"
import TitleField from "../sections/title-field"
import FixedSettings from "../sections/settingsbar/fixed-settings"
import StickySettings from "../sections/settingsbar/sticky-settings"
import dynamic from "next/dynamic"
const EmailRestrictsField = dynamic(() => import("../sections/email-restricts-field"))
const ParagraphFields = dynamic(() => import("../sections/description-fields"))
const FormFields = dynamic(() => import("../sections/form-fields"))

interface EditorComponentProps extends DispatchFormConfig {
    formConfig: EditorFormConfig
    setRefetch: Dispatch<SetStateAction<boolean>>
}

export default function EditorComponent({ formConfig, dispatchFormConfig, setRefetch }: EditorComponentProps){

    const [shrinkSetting, setShrinkSetting] = useState(false)

    if(formConfig.eventConfig === 'loading'){
        return <></>
    }
    return(
        <>
            <div><Toaster/></div>
            <div
                className="w-full h-full flex flex-col overflow-y-auto bg-gray-200 dark:bg-black/70"
                onScroll={(e) => {
                    const element = e.target as HTMLDivElement
                    setShrinkSetting(element.scrollTop > 160)
                }}
            >
                <TitleField title={formConfig.title ?? ''} dispatchFormConfig={dispatchFormConfig}/>
                <FixedSettings
                    formConfig={formConfig}
                    dispatchFormConfig={dispatchFormConfig}
                />
                <StickySettings
                    eventId={formConfig.eventConfig.id}
                    formConfig={formConfig}
                    dispatchFormConfig={dispatchFormConfig}
                    shrinkSetting={shrinkSetting}
                    setRefetch={setRefetch}
                />
                <EmailRestrictsField
                    emailRestricts={formConfig.email_restricts ?? []}
                    dispatchFormConfig={dispatchFormConfig}
                />
                <ParagraphFields
                    field_key="description"
                    paragraph={formConfig.description ?? ''}
                    dispatchFormConfig={dispatchFormConfig}
                />
                <ParagraphFields
                    field_key="submitted_area"
                    paragraph={formConfig.submitted_area ?? ''}
                    dispatchFormConfig={dispatchFormConfig}
                />
                <FormFields
                    eventConfig={formConfig.eventConfig}
                    formFields={formConfig.form_fields ?? {}}
                    fieldOrder={formConfig.field_order ?? []}
                    dispatchFormConfig={dispatchFormConfig}
                />
            </div>
        </>
    )
}