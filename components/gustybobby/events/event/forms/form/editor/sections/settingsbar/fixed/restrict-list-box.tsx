import { ListBoxMultiSelect } from "@/components/tools/list-box"
import type { EventConfigProperty } from "@/server/classes/eventconfig"
import { memo, useMemo } from "react"
import type { DispatchFormConfig } from "../../../handlers/state-manager"
import EventConfig from "@/server/classes/eventconfig"
import type { GustybobbyOption } from "@/server/typeconfig/form"

interface RestrictListBoxProps extends DispatchFormConfig {
    eventConfig: EventConfigProperty
    positionRestricts: { id: string }[]
    roleRestricts: { id: string }[]
    disabled: boolean
}

function RestrictListBoxComponent({ eventConfig, positionRestricts, roleRestricts, dispatchFormConfig, disabled }: RestrictListBoxProps){

    const positionRestrictOptions = useMemo(() => {
        return (new EventConfig(eventConfig)).getPositionRestrictOptions(positionRestricts)
    }, [eventConfig, positionRestricts])

    const roleRestrictOptions = useMemo(() => {
        return (new EventConfig(eventConfig)).getRoleRestrictOptions(roleRestricts)
    }, [eventConfig, roleRestricts])

    return(
        <div className="flex flex-col items-end md:items-center order-4 md:order-2">
            <div>
                <div className="mb-1 px-2 py-1 rounded-lg bg-pink-400 dark:bg-pink-600 w-fit">
                    Form Access
                </div>
                <div className="mb-1">
                    <ListBoxMultiSelect
                        placeholder="Position"
                        list={positionRestrictOptions}
                        setList={(list: GustybobbyOption[])=>{
                            const position_restricts = list.filter((item)=>item.active).map(({ id })=> ({ id }))
                            dispatchFormConfig({ type: 'edit_access', key: 'position_restricts', value: position_restricts })
                            return
                        }}
                        width="w-36"
                        maxHeight="max-h-28"
                        disabled={disabled}
                    />
                </div>
                <div>
                    <ListBoxMultiSelect
                        placeholder="Role"
                        list={roleRestrictOptions}
                        setList={(list: GustybobbyOption[])=>{
                            const role_restricts = list.filter((item)=>item.active).map(({ id })=> ({ id }))
                            dispatchFormConfig({ type: 'edit_access', key: 'role_restricts', value: role_restricts })
                        }}
                        width="w-36"
                        maxHeight="max-h-28"
                        disabled={disabled}
                    />
                </div>
            </div>
        </div>
    )
}

const RestrictListBox = memo(RestrictListBoxComponent)
export default RestrictListBox