"use client"

import { InputField } from "../../../../input"
import { ContentFieldComponentProps } from "../content-fields-types"

export default function ShortAnswerField({ contentConfig, defaultInteract, editor  }: ContentFieldComponentProps){
    if(!editor){
        contentConfig.validate()
    }
    return (
        <InputField
            id={contentConfig.getFieldId()}
            label={contentConfig.getLabel(editor)}
            type="text"
            placeholder={contentConfig.placeholder}
            defaultValue={contentConfig.default_value}
            pattern={new RegExp(contentConfig.getPattern())}
            success={contentConfig.success}
            error={contentConfig.error}
            required={contentConfig.required}
            size="lg"
            defaultInteract={defaultInteract}
        />
    )
}