"use client"

import { sectionStyles } from "@/components/styles/sections"
import GustybobbyTableLoading from "@/components/tools/gustybobby-tables/tables/gustybobby-table-loading"
import useAttendanceMembersTable from "@/components/tools/gustybobby-tables/tables/hooks/use-attendance-members-table"
import MembersTable from "@/components/tools/gustybobby-tables/tables/members-table"
import type Table from "@/server/classes/table"
import type { GustybobbyAppointment } from "@/server/typeconfig/record"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

export default function AttdViewSchedule({ eventId, role, appt, regist }: {
    eventId: string,
    role: 'gustybobby' | 'user'
    appt: GustybobbyAppointment | undefined
    regist: boolean
}){

    const router = useRouter()
    const pathname = usePathname()
    const [transformation, setTransformation] = useState<Table['transformation']>({})
    const { table, refetch } = useAttendanceMembersTable({ eventId, role, apptId: appt?.id ?? '', tableView: 'attd', transformation })

    if(!appt || !regist){
        router.replace(pathname)
        return <></>
    }
    if(table === 'error'){
        throw 'table fetching error'
    }
    return(
        <div className="min-h-screen bg-gray-200 dark:bg-black/70 border border-black dark:border-white">
            <div className="p-1 flex justify-between md:grid md:grid-cols-3 border-b border-black dark:border-white">
                <button
                    className={sectionStyles.button({ color: 'gray', border: true, hover: true })}
                    onClick={() => router.push(pathname+`?view=appt&appt_id=${appt.id}`)}
                >
                    Back
                </button>
                <span className="font-bold text-2xl text-center">
                    Attendances
                </span>
            </div>
            <div className="m-2">
                {table === 'loading'?
                <GustybobbyTableLoading/>
                :
                <MembersTable
                    table={table}
                    headerCellClassName=""
                />
                }
            </div>
        </div>
    )
}