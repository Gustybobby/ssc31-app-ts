"use client"

import { BasicSyntaxedContentDisplay, descriptionTextAreaStyle, formatText } from "@/components/tools/paragraph";
import { EditorContentFieldComponentProps } from "../content-fields-types";

export default function InfoField({ contentConfig, dispatchFormConfig }: EditorContentFieldComponentProps){
    return(
        <div className="flex flex-col space-y-2">
            <BasicSyntaxedContentDisplay 
                className="flex flex-col justify-start bg-gray-200 dark:bg-black/70 p-6 rounded-2xl space-y-2"
                textString={contentConfig.label}
            />
            <textarea 
                id={contentConfig.id}
                className={descriptionTextAreaStyle}
                placeholder="Info Field"
                onChange={(e)=>{
                    dispatchFormConfig({
                        type: 'edit_field_string',
                        field_id: contentConfig.id,
                        key: 'label',
                        value: formatText(e.target.value, contentConfig.label)
                    })
                }}
                value={contentConfig.label}
            />
        </div>
    )
}