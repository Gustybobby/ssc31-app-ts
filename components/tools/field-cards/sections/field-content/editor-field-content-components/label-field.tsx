"use client"

import { InputField } from "@/components/tools/input"
import { EditorContentFieldComponentProps } from "../content-fields-types"
import { contentPatterns } from "@/server/classes/forms/contentconfig"

export default function LabelField({ contentConfig, dispatchFormConfig }: EditorContentFieldComponentProps){
    return(
        <div className="md:w-2/3">
            <InputField
                id={contentConfig.id}
                type="text"
                pattern={contentPatterns.label}
                required={false}
                size="lg"
                autoComplete="off"
                defaultValue={contentConfig.label}
                onChange={(e) => dispatchFormConfig({
                    type: 'edit_field_string',
                    field_id: contentConfig.id,
                    key: 'label',
                    value: e.target.value
                })}
            />
        </div>
    )
}