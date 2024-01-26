"use client"

import PopUpDialog from "@/components/tools/pop-up-dialog"
import useAppointmentMembersTable from "@/components/tools/gustybobby-tables/tables/hooks/use-appointment-members-table"
import type { Dispatch, SetStateAction } from "react"
import GustybobbyTableLoading from "@/components/tools/gustybobby-tables/tables/gustybobby-table-loading"
import MembersTable from "@/components/tools/gustybobby-tables/tables/members-table"

export default function ParticipantsHoursPopUp({ eventId, selectedApptId, open, setOpen }: {
    eventId: string,
    selectedApptId: string | null
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}){
    const { table } = useAppointmentMembersTable({
        eventId,
        role: 'gustybobby',
        tableView: 'attd',
        apptId: selectedApptId ?? '',
        transformation: undefined,
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