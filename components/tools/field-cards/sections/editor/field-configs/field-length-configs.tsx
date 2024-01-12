"use client"

import type { DispatchFormConfig } from "@/components/gustybobby/events/event/forms/form/editor/handlers/state-manager"
import { InputField } from "@/components/tools/input"
import { contentPatterns } from "@/server/classes/forms/contentconfig"
import type { DataType } from "@/server/typeconfig/form"

interface FieldLengthConfigsProps extends DispatchFormConfig{
    fieldId: string
    dataType: DataType
    fieldMinLength: number
    fieldMaxLength: number
}

export default function FieldLengthConfigs({ fieldId, dataType, fieldMinLength, fieldMaxLength, dispatchFormConfig }: FieldLengthConfigsProps){
    const minLengthPattern = (dataType === 'NUM_STRING')? contentPatterns.min_length : contentPatterns.min_value
    const maxLengthPattern = (dataType === 'NUM_STRING')? contentPatterns.max_length : contentPatterns.max_value
    return(
        <div className="flex flex-col space-y-1 w-1/2">
            <InputField
                id={`${fieldId}_MIN_LENGTH`}
                label="Min Length"
                type="text"
                placeholder="min length"
                pattern={minLengthPattern}
                size="sm"
                required={false}
                defaultValue={String(fieldMinLength)}
                onChange={(e) => dispatchFormConfig({
                    type: 'edit_field_number',
                    field_id: fieldId,
                    key: 'min_length',
                    value: e.target.value.match(minLengthPattern)? Number(e.target.value) : 0
                })}
            />
            <InputField
                id={`${fieldId}_MAX_LENGTH`}
                label="Max Length"
                type="text"
                placeholder="max length"
                pattern={maxLengthPattern}
                size="sm"
                required={false}
                defaultValue={String(fieldMaxLength)}
                onChange={(e) => dispatchFormConfig({
                    type: 'edit_field_number',
                    field_id: fieldId,
                    key: 'max_length',
                    value: e.target.value.match(maxLengthPattern)? Number(e.target.value) : 0
                })}
            />
        </div>
    )
}