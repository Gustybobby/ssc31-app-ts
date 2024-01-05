"use client"

import type { DispatchFormConfig } from "@/components/gustybobby/events/event/forms/form/editor/handlers/state-manager"
import { InputField } from "@/components/tools/input"
import { contentPatterns } from "@/server/classes/forms/contentconfig"

interface FieldLengthConfigsProps extends DispatchFormConfig{
    fieldId: string
    fieldMinLength: number
    fieldMaxLength: number
}

export default function FieldLengthConfigs({ fieldId, fieldMinLength, fieldMaxLength, dispatchFormConfig }: FieldLengthConfigsProps){
    return(
        <div className="flex flex-col space-y-1 w-1/2">
            <InputField
                id={`${fieldId}_MIN_LENGTH`}
                label="Min Length"
                type="text"
                placeholder="min length"
                pattern={contentPatterns.min_length}
                size="sm"
                required={false}
                defaultValue={String(fieldMinLength)}
                onChange={(e) => dispatchFormConfig({
                    type: 'edit_field_number',
                    field_id: fieldId,
                    key: 'min_length',
                    value: e.target.value.match(contentPatterns.min_length)? Number(e.target.value) : 0
                })}
            />
            <InputField
                id={`${fieldId}_MAX_LENGTH`}
                label="Max Length"
                type="text"
                placeholder="max length"
                pattern={contentPatterns.max_length}
                size="sm"
                required={false}
                defaultValue={String(fieldMaxLength)}
                onChange={(e) => dispatchFormConfig({
                    type: 'edit_field_number',
                    field_id: fieldId,
                    key: 'max_length',
                    value: e.target.value.match(contentPatterns.max_length)? Number(e.target.value) : 0
                })}
            />
        </div>
    )
}