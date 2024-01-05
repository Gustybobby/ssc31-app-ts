"use client"

import type { DispatchFormConfig } from "@/components/gustybobby/events/event/forms/form/editor/handlers/state-manager"
import { ListBoxMultiSelect } from "@/components/tools/list-box"
import type { EventConfigProperty } from "@/server/classes/eventconfig"
import EventConfig from "@/server/classes/eventconfig"
import { useMemo } from "react"

interface FieldDataAccessListBoxProps extends DispatchFormConfig {
    eventConfig: EventConfigProperty
    fieldId: string
    fieldPositionAccess: string[]
    fieldRoleAccess: string[]
}

export default function FieldDataAccessListBox({
    eventConfig,
    fieldId,
    fieldPositionAccess,
    fieldRoleAccess,
    dispatchFormConfig
}: FieldDataAccessListBoxProps
){

    const positionDataAccessOptions = useMemo(() => {
        return (new EventConfig(eventConfig)).getPositionFieldAccessOptions(fieldPositionAccess)
    }, [eventConfig, fieldPositionAccess])
    const roleDataAccessOptions = useMemo(() => {
        return (new EventConfig(eventConfig)).getRoleFieldAccessOptions(fieldRoleAccess)
    }, [eventConfig, fieldRoleAccess])

    return(
        <div className="space-y-2">
            <ListBoxMultiSelect
                list={positionDataAccessOptions}
                setList={(list) => {
                    const newPositionAccess = list.filter((item)=>item.active).map((item)=>item.id)
                    dispatchFormConfig({ 
                        type: 'edit_field_access',
                        field_id: fieldId,
                        key: 'position_access',
                        value: newPositionAccess
                    })
                }}
                placeholder="Position Access"
                width="w-36"
                maxHeight="max-h-48"
            />
            <ListBoxMultiSelect
                list={roleDataAccessOptions}
                setList={(list) => {
                    const newRoleAccess = list.filter((item)=>item.active).map((item)=>item.id)
                    dispatchFormConfig({ 
                        type: 'edit_field_access',
                        field_id: fieldId,
                        key: 'role_access',
                        value: newRoleAccess
                    })
                }}
                placeholder="Role Access"
                width="w-36"
                maxHeight="max-h-48"
            />
        </div>
    )
}