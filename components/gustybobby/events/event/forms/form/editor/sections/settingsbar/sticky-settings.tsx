"use client"

import type { FormConfigProperty } from "@/server/classes/forms/formconfig"
import OpenSwitch from "./sticky/open-switch"
import PublicSwitch from "./sticky/public-switch"
import ResponseTypeSwitch from "./sticky/response-type-switch"
import ViewFormLink from "./sticky/view-form-link"
import SaveButton from "./sticky/save-button"
import CreateButton from "./sticky/create-button"
import type { Dispatch, SetStateAction } from "react"
import type { DispatchFormConfig } from "../../editor-types"

interface StickySettingsProps extends DispatchFormConfig {
    eventId: string
    formConfig: FormConfigProperty
    shrinkSetting: boolean
    setRefetch: Dispatch<SetStateAction<boolean>>
}

export default function StickySettings({ eventId, formConfig, shrinkSetting, dispatchFormConfig, setRefetch }: StickySettingsProps){
    return(
        <div className={styles.stickySettingBox(shrinkSetting)}>
            {formConfig.id?
                <SaveButton
                    eventId={eventId}
                    formConfig={formConfig}
                    setRefetch={setRefetch}
                />
                :
                <CreateButton
                    eventId={eventId}
                    formConfig={formConfig}
                />
            }
            <OpenSwitch
                open={!!formConfig.open}
                dispatchFormConfig={dispatchFormConfig}
            />
            <PublicSwitch
                publicForm={!!formConfig.public}
                dispatchFormConfig={dispatchFormConfig}
            />
            <ResponseTypeSwitch
                responseType={formConfig.response_type ?? 'SINGLE'}
                dispatchFormConfig={dispatchFormConfig}
            />
            {formConfig.id &&
            <ViewFormLink
                eventId={eventId}
                formId={formConfig.id}
            />
            }
        </div>
    )
}

const styles = {
    stickySettingBox: (shrinkSetting: boolean) => [
        'sticky top-0 p-2',
        'grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-5',
        'shadow-lg transition-colors',
        shrinkSetting? 'z-40 bg-gray-300 dark:bg-gray-500' : 'bg-gray-100 dark:bg-white/40',
    ].join(' '),
}