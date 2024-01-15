"use client"

import type { dispatchApptConfig } from "../edit-appt-view-schedule"
import MembersTable from "@/components/tools/gustybobby-tables/tables/members-table"
import GustybobbyTableLoading from "@/components/tools/gustybobby-tables/tables/gustybobby-table-loading"
import useSelectableMembersTable from "@/components/tools/gustybobby-tables/tables/hooks/use-selectable-members-table"
import type { EditableAppointment } from "@/server/typeconfig/record"
import { useEffect } from "react"

interface PartySelectorTableProps extends dispatchApptConfig {
    eventId: string
    role: 'gustybobby' | 'user'
    partyMembers: EditableAppointment['party_members']
}

export default function PartySelectorTable({ eventId, role, partyMembers, dispatchApptConfig }: PartySelectorTableProps){

    const { table, memberSelects } = useSelectableMembersTable({
        eventId,
        role,
        selection: Object.fromEntries(partyMembers.map((member) => [member.id, true]))
    })

    useEffect(() => {
        dispatchApptConfig({ type: 'edit_member_selects', value: memberSelects })
    }, [memberSelects, dispatchApptConfig])

    if(table === 'error'){
        throw 'fetch table error'
    }
    if(table === 'loading'){
        return <GustybobbyTableLoading/>
    }
    return(
       <MembersTable table={table} headerCellClassName=""/>
    )
}