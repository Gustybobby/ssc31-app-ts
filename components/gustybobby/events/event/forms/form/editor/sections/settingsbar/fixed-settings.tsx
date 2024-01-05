"use client"

import DataAccessListBox from "./fixed/data-access-list-box"
import type { DispatchFormConfig } from "../../handlers/state-manager"
import RestrictListBox from "./fixed/restrict-list-box"
import TypeListBox from "./fixed/type-list-box"
import TemplateThisButton from "./fixed/template-this-button"
import type { EditorFormConfig } from "../../hooks/form-config-reducer"

interface FixedSettingsProps extends DispatchFormConfig {
    formConfig: EditorFormConfig
}

export default function FixedSettings({ formConfig, dispatchFormConfig }: FixedSettingsProps){
    if(formConfig.eventConfig === 'loading'){
        return <></>
    }
    return(
        <div className="p-2 grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-5 bg-gray-100 dark:bg-white/40">
            <DataAccessListBox
                eventConfig={formConfig.eventConfig}
                positionAccess={formConfig.global_position_access ?? []}
                roleAccess={formConfig.global_role_access ?? []}
                dispatchFormConfig={dispatchFormConfig}
            />
            <RestrictListBox
                eventConfig={formConfig.eventConfig}
                positionRestricts={formConfig.position_restricts ?? []}
                roleRestricts={formConfig.role_restricts ?? []}
                dispatchFormConfig={dispatchFormConfig}
                disabled={formConfig.type === 'JOIN'}
            />
            <TypeListBox
                formType={formConfig.type ?? 'OTHER'}
                dispatchFormConfig={dispatchFormConfig}
            />
            <TemplateThisButton
                formFields={formConfig.form_fields ?? {}}
                fieldOrder={formConfig.field_order ?? []}  
            />
        </div>
    )
}
