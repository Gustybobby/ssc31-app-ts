"use client"

import { dataTypes } from "@/server/typeconfig/form"
import { InputField } from "../../../../input"
import { ContentFieldComponentProps } from "../content-fields-types"
import { useCallback } from "react"

export default function ShortAnswerField({ contentConfig, defaultInteract, editor  }: ContentFieldComponentProps){

    const customValid = useCallback((input: string) => {
        if(dataTypes[contentConfig.data_type].specialValid?.(input, contentConfig)){
            return { valid: true, message: 'good' }
        }
        return { valid: false, message: 'error' }
    }, [contentConfig])

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
            customValid={dataTypes[contentConfig.data_type].specialValid? customValid: undefined}
        />
    )
}