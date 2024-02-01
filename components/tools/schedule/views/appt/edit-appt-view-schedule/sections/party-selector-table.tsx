"use client"

import type { dispatchApptConfig } from "../edit-appt-view-schedule"
import MembersTable from "@/components/tools/gustybobby-tables/tables/members-table"
import GustybobbyTableLoading from "@/components/tools/gustybobby-tables/tables/gustybobby-table-loading"
import useSelectableMembersTable from "@/components/tools/gustybobby-tables/tables/hooks/use-selectable-members-table"
import type { EditableAppointment } from "@/server/typeconfig/record"
import { useEffect, useState } from "react"
import type Table from "@/server/classes/table"
import GustybobbyFilters from "@/components/tools/gustybobby-tables/transformation/gustybobby-filters/gustybobby-filters"

interface PartySelectorTableProps extends dispatchApptConfig {
    eventId: string
    role: 'gustybobby' | 'user'
    partyMembers: EditableAppointment['party_members']
}

export default function PartySelectorTable({ eventId, role, partyMembers, dispatchApptConfig }: PartySelectorTableProps){

    const [transformation, setTransformation] = useState<Table['transformation']>({})
    const { table, memberSelects, defaultGroups } = useSelectableMembersTable({
        eventId,
        role,
        selection: Object.fromEntries(partyMembers.map((member) => [member.id, true])),
        tableView: 'appt',
        transformation,
    })
    
    useEffect(() => {
        dispatchApptConfig({ type: 'edit_member_selects', value: memberSelects })
    }, [memberSelects, dispatchApptConfig])

    if(table === 'error' || defaultGroups === 'error'){
        throw 'fetch table error'
    }
    if(table === 'loading' || defaultGroups === 'loading'){
        return <GustybobbyTableLoading/>
    }
    return(
       <div className="space-y-1">
            <GustybobbyFilters
                columnOptions={memberColumns.concat(
                    defaultGroups.map((group, index) => ({
                        id: group.id,
                        label: group.label.toString(),
                        index: index + 2,
                        active: false
                })))}
                transformationFilters={transformation?.filters ?? {}}
                setTransformation={setTransformation}
            />
            <div className="h-[90vh] overflow-auto">
                <MembersTable
                    table={table}
                    headerCellClassName="min-w-28 flex justify-between"
                    transformation={transformation}
                    setTransformation={setTransformation}
                />
            </div>
       </div>
    )
}

const memberColumns = [
    {
        id: 'role',
        label: 'Role',
        index: 0,
        active: false,
    },
    {
        id: 'position',
        label: 'Position',
        index: 1,
        active: false,
    },
]