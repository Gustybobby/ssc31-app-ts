"use client"

import { sectionStyles } from "@/components/styles/sections"
import MembersTable from "@/components/tools/gustybobby-tables/tables/members-table"
import Table, { type RowProperty } from "@/server/classes/table"
import type { ActivityRecord } from "@/server/typeconfig/record"
import { useState } from "react"

export default function ActivityHours({ activityRecords, activityHours }: {
    activityRecords: { [appt_id: string]: ActivityRecord }
    activityHours: number
}){
    const [table, setTable] = useState(initializedTable(activityRecords, activityHours))

    return (
        <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
            <h1 className={sectionStyles.title({ color: 'cyan', extensions: 'mb-2' })}>Activity Hours</h1>
            <MembersTable table={table} headerCellClassName=""/>
        </div>
    )
}

function initializedTable(activityRecords: { [appt_id: string]: ActivityRecord }, activityHours: number){
    const records = Object.entries(activityRecords).map(([appt_id, record]) => ({
        key: appt_id,
        value: {
            label: {
                id: "label",
                type: "pure_single",
                data: record.label,
                raw_data: record.label,
            },
            start_at: {
                id: "start_at",
                type: "pure_single",
                data: (new Date(record.start_at)).toLocaleString(),
                raw_data: (new Date(record.start_at)).toLocaleString(),
            },
            end_at: {
                id: "end_at",
                type: "pure_single",
                data: (new Date(record.end_at)).toLocaleString(),
                raw_data: (new Date(record.end_at)).toLocaleString(),
            },
            hrs: {
                id: "hrs",
                type: "pure_single",
                data: record.hrs.toFixed(2),
                raw_data: record.hrs.toFixed(2),
            },
        }
    })) as RowProperty[]
    records.sort((a,b) => new Date(activityRecords[a.key].start_at) > new Date(activityRecords[b.key].start_at)? 1 : -1)
    const total = {
        key: "total_hrs",
        value: {
            label: {
                id: "label",
                type: "pure_single",
                data: <div className="text-xl font-bold">Total</div>,
                raw_data: "Total",
            },
            start_at: {
                id: "start_at",
                type: "pure_single",
                data: "-",
                raw_data: "-",
            },
            end_at: {
                id: "end_at",
                type: "pure_single",
                data: "-",
                raw_data: "-",
            },
            hrs: {
                id: "hrs",
                type: "pure_single",
                data: <div className="text-xl font-bold">{activityHours.toFixed(2)}</div>,
                raw_data: activityHours.toFixed(2),
            },
        }
    } as RowProperty
    return Table.initialize({
        columns: [
            { id: "label", label: "Title", data_type: "STRING", field_type: "SHORTANS", type: "pure" },
            { id: "hrs", label: "Hours", data_type: "STRING", field_type: "SHORTANS", type: "pure" },
            { id: "start_at", label: "Start At", data_type: "STRING", field_type: "SHORTANS", type: "pure" },
            { id: "end_at", label: "End At", data_type: "STRING", field_type: "SHORTANS", type: "pure" },
        ],
        rows: records.concat(total)
    })
}