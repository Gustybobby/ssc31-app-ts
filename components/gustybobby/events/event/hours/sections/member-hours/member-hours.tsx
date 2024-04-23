"use client"

import { sectionStyles } from "@/components/styles/sections"
import useHours from "../../hooks/use-hours"
import MembersTable from "@/components/tools/gustybobby-tables/tables/members-table"
import type { StudentMember, TransferRecord } from "@/server/typeconfig/record"

export default function MemberHours({ eventId, eventCreatedAt, members, activityHours, transferRecords }: {
    eventId: string
    eventCreatedAt: Date
    members: StudentMember[]
    activityHours: { [member_id: string]: number }
    transferRecords: { [member_id: string]: { [key: string]: TransferRecord }}
}){
    const { actTable, scholTable, transformation, setTransformation } = useHours({
        eventId,
        members,
        activityHours,
        eventCreatedAt,
        transferRecords
    })
    return (
        <>
            <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                <h1 className={sectionStyles.title({ color: 'cyan', extensions: 'mb-2' })}>Activity Hours</h1>
                {typeof actTable !== "string" &&
                <MembersTable
                    table={actTable}
                    headerCellClassName="max-h-12 min-w-48 flex justify-between"
                    transformation={transformation}
                    setTransformation={setTransformation}
                />
                }
            </div>
            <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                <h1 className={sectionStyles.title({ color: 'green', extensions: 'mb-2' })}>Scholarship Hours</h1>
                {typeof scholTable !== "string" &&
                <MembersTable
                    table={scholTable}
                    headerCellClassName="max-h-12 min-w-48 flex justify-between"
                />
                }
            </div>
        </>
    )
}