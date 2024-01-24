"use client"

import type { DispatchFormConfig } from "@/components/gustybobby/events/event/forms/form/editor/editor-types"
import { InputField } from "@/components/tools/input"
import { contentPatterns } from "@/server/classes/forms/contentconfig"

interface FieldValidationConfigsProps extends DispatchFormConfig{
    fieldId: string
    fieldPlaceholder: string
    fieldSuccess: string
    fieldError: string
}

export default function FieldValidationConfigs({ fieldId, fieldPlaceholder, fieldSuccess, fieldError, dispatchFormConfig
}: FieldValidationConfigsProps){
    return(
        <div className="flex flex-col space-y-1 md:w-2/3">
            <InputField
                id={`${fieldId}_PLACEHOLDER`}
                label="Placeholder"
                type="text"
                placeholder="placeholder"
                pattern={contentPatterns.placeholder}
                size="sm"
                required={false}
                defaultValue={fieldPlaceholder}
                onChange={(e) => dispatchFormConfig({
                    type: 'edit_field_string',
                    field_id: fieldId,
                    key: 'placeholder',
                    value: e.target.value
                })}
            />
            <InputField
                id={`${fieldId}_SUCCESS`}
                label="Success"
                type="text"
                placeholder="success message"
                pattern={contentPatterns.success}
                size="sm"
                required={false}
                defaultValue={fieldSuccess}
                onChange={(e) => dispatchFormConfig({
                    type: 'edit_field_string',
                    field_id: fieldId,
                    key: 'success',
                    value: e.target.value
                })}
            />
            <InputField
                id={`${fieldId}_ERROR`}
                label="Error"
                type="text"
                placeholder="error message"
                pattern={contentPatterns.error}
                size="sm"
                required={false}
                defaultValue={fieldError}
                onChange={(e) => dispatchFormConfig({
                    type: 'edit_field_string',
                    field_id: fieldId,
                    key: 'error',
                    value: e.target.value
                })}
            />
        </div>
    )
}