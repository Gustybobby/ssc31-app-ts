"use client"

import type { DispatchFormConfig } from "@/components/gustybobby/events/event/forms/form/editor/handlers/state-manager"
import { sectionStyles } from "@/components/styles/sections"
import { InputField } from "@/components/tools/input"
import { contentPatterns } from "@/server/classes/forms/contentconfig"
import type { DataType, GustybobbyOption } from "@/server/typeconfig/form"
import { RxCross1 } from "react-icons/rx"

interface FieldOptionsConfigsProps extends DispatchFormConfig{
    fieldId: string
    dataType: DataType
    fieldOptions: GustybobbyOption[]
}

export default function FieldOptionsConfigs({ fieldId, dataType, fieldOptions, dispatchFormConfig }: FieldOptionsConfigsProps){

    return(
        <div className="flex flex-col space-y-1">
            {fieldOptions.map((option, index) => (
            <div key={`${option.id}_LABEL`} className="flex items-center space-x-2">
                <InputField
                    id={option.id}
                    label={`Option ${index+1}`}
                    type="text"
                    pattern={dataType === 'STRING'? contentPatterns.option_text : contentPatterns.option_num}
                    required={false}
                    size="sm"
                    defaultValue={option.label}
                    onChange={(e) => dispatchFormConfig({
                        type: 'edit_field_option_label',
                        field_id: fieldId,
                        option_index: index,
                        value: e.target.value
                    })}
                />
                <button
                    className={sectionStyles.button({ color: 'red', hover: true, border: true, extensions: 'mt-4' })}
                    onClick={() => dispatchFormConfig({
                        type: 'edit_field_delete_option',
                        field_id: fieldId,
                        option_id: option.id,
                    })}
                >
                    <div className="my-1"><RxCross1/></div>
                </button>
            </div>
            ))}
            <button
                className={sectionStyles.button({ color: 'green', hover: true, border: true })}
                onClick={() => dispatchFormConfig({ type: 'edit_field_new_option', field_id: fieldId })}
            >
                <span className="text-lg">Add Option</span>
            </button>
        </div>
    )
}