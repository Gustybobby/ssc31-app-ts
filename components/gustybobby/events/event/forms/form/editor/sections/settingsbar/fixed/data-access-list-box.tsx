import { ListBoxMultiSelect } from "@/components/tools/list-box"
import type { EventConfigProperty } from "@/server/classes/eventconfig"
import { memo, useMemo } from "react"
import EventConfig from "@/server/classes/eventconfig"
import type { DispatchFormConfig } from "../../../editor-types"

interface DataAccessListBoxProps extends DispatchFormConfig {
    eventConfig: EventConfigProperty
    positionAccess: { id: string }[]
    roleAccess: { id: string }[]
}

function DataAccessListBoxComponent({ eventConfig, positionAccess, roleAccess, dispatchFormConfig }: DataAccessListBoxProps){

    const positionDataAccessOptions = useMemo(() => {
        return (new EventConfig(eventConfig)).getPositionDataAccessOptions(positionAccess)
    }, [eventConfig, positionAccess])
    const roleDataAccessOptions = useMemo(() => {
        return (new EventConfig(eventConfig)).getRoleDataAccessOptions(roleAccess)
    }, [eventConfig, roleAccess])

    return(
        <div className="flex flex-col justify-start w-fit order-3 md:order-1">
            <div className="mb-1 px-2 py-1 rounded-lg bg-pink-400 dark:bg-pink-600 w-fit">
                Data Access
            </div>
            <div className="mb-1">
                <ListBoxMultiSelect
                    placeholder="Position"
                    list={positionDataAccessOptions}
                    setList={(list)=>{
                        const global_position_access = list.filter((item)=>item.active).map(({ id })=> ({ id }))
                        dispatchFormConfig({ type: 'edit_access', key: 'global_position_access', value: global_position_access })
                    }}
                    width="w-36"
                    maxHeight="max-h-28"
                />
            </div>
            <div>
                <ListBoxMultiSelect
                    placeholder="Role"
                    list={roleDataAccessOptions}
                    setList={(list)=>{
                        const global_role_access = list.filter((item)=>item.active).map(({ id })=> ({ id }))
                        dispatchFormConfig({ type: 'edit_access', key: 'global_role_access', value: global_role_access })
                    }}
                    width={'w-36'}
                    maxHeight={'max-h-28'}
                />
            </div>
        </div>
    )
}

const DataAccessListBox = memo(DataAccessListBoxComponent)
export default DataAccessListBox