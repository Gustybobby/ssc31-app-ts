"use client"

import PopUpDialog from "@/components/tools/pop-up-dialog"
import type { Dispatch, SetStateAction } from "react"
import GustybobbyTableLoading from "@/components/tools/gustybobby-tables/tables/gustybobby-table-loading"
import dynamic from "next/dynamic"
import useAttendanceMembersTable from "@/components/tools/gustybobby-tables/tables/hooks/use-attendance-members-table"
const MembersTable = dynamic(() => import("@/components/tools/gustybobby-tables/tables/members-table"), {
    loading: () => <GustybobbyTableLoading/>
})

export default function ParticipantsHoursPopUp({ eventId, selectedApptId, apptPublic, open, setOpen }: {
    eventId: string,
    selectedApptId: string | null
    apptPublic: boolean,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}){
    const { table } = useAttendanceMembersTable({
        eventId,
        role: 'gustybobby',
        tableView: 'attd',
        apptId: selectedApptId ?? '',
        transformation: undefined,
        hideButtons: true,
        apptPublic,
    })

    if(table === 'error'){
        throw 'table fetching error'
    }
    return (
        <PopUpDialog open={open} setOpen={setOpen} panelClassName="w-full bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="p-2 max-h-96 overflow-auto">
                {table === 'loading'?
                <GustybobbyTableLoading/>
                :
                <MembersTable table={table} headerCellClassName=""/>
                }
            </div>
        </PopUpDialog>
    )
}