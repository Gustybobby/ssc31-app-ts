"use client"

import type { AppointmentConfig } from "@/components/tools/gustybobby-tables/config-fetchers/config-types"
import GustybobbyTableLoading from "@/components/tools/gustybobby-tables/tables/gustybobby-table-loading"
import useAppointmentMembersTable from "@/components/tools/gustybobby-tables/tables/hooks/use-appointment-members-table"
import MembersTable from "@/components/tools/gustybobby-tables/tables/members-table"
import type Table from "@/server/classes/table"
import { useState } from "react"

export default function InterviewMembersTable({ eventId, role, apptId }: AppointmentConfig){
    const [transformation, setTransformation] = useState<Table['transformation']>({})
    const { table } = useAppointmentMembersTable({ eventId, role, tableView: 'intv', apptId, transformation: transformation })

    if(table === 'error'){
        throw 'table fetching error'
    }
    if(table === 'loading'){
        return <GustybobbyTableLoading/>
    }
    return (
        <div className="m-2">
            <MembersTable
                table={table}
                headerCellClassName="min-w-36"
            />
        </div>
    )
}