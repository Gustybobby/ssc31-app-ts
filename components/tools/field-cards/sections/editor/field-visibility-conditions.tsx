"use client"

import type { DispatchFormConfig } from "@/components/gustybobby/events/event/forms/form/editor/handlers/state-manager"
import { ListBoxMultiSelect, ListBoxSingleSelect } from "@/components/tools/list-box"
import FieldVisibility, { visibilityBoolCodes } from "@/server/classes/forms/fieldvisibility"
import type { GustybobbyOption } from "@/server/typeconfig/form"
import { useMemo } from "react"

interface FieldVisibilityConditionsProps extends DispatchFormConfig {
    fieldId: string
    visibleConds: string
    allPreviousOptions: GustybobbyOption[]
}

export default function FieldVisibilityConditions({ fieldId, visibleConds, allPreviousOptions, dispatchFormConfig
}: FieldVisibilityConditionsProps){
    
    const fieldVisibility = useMemo(() => FieldVisibility.fromString(visibleConds), [visibleConds])

    const boolCodeOptions: GustybobbyOption[] = useMemo(() => {
        return visibilityBoolCodes.map((code, index) => ({
            id: code,
            label: code,
            index: index,
            active: code === fieldVisibility.boolCode
        }))
    },[fieldVisibility])

    const triggerOptions: GustybobbyOption[] = useMemo(() => {
        return allPreviousOptions.map((option) => ({
            ...option,
            active: !!fieldVisibility.triggerFieldOptions?.[option.id.split('_')[0]]?.includes(option.index)
        }))
    }, [fieldVisibility, allPreviousOptions])
    
    return(
        <div className="flex flex-col md:items-end space-y-1 md:col-start-4">
            <span className="font-bold">Visibility Conditions</span>
            <ListBoxSingleSelect
                list={boolCodeOptions}
                setList={(list) => {
                    dispatchFormConfig({
                        type: 'edit_field_bool_code',
                        field_id: fieldId,
                        code: list.find((item) => item.active).id
                    })
                }}
                width="w-20"
                maxHeight="max-h-32"
            />
            <ListBoxMultiSelect
                list={triggerOptions}
                placeholder="Triggers"
                setList={(list) => dispatchFormConfig({
                    type: 'edit_field_triggers',
                    field_id: fieldId,
                    options: list.filter((item) => item.active)
                })}
                width="w-36"
                maxHeight="max-h-28"
            />
        </div>
    )
}