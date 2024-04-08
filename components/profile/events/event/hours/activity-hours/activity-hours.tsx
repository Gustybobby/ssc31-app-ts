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
    const rows = Object.entries(activityRecords).map(([appt_id, record]) => ({
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
                data: record.hrs.toString(),
                raw_data: record.hrs.toString(),
            },
        }
    })).concat({
        key: "total_hrs",
        value: {
            label: {
                id: "label",
                type: "pure_single",
                data: "Total",
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
                data: activityHours.toString(),
                raw_data: activityHours.toString(),
            },
        }
    }) as RowProperty[]
    return Table.initialize({
        columns: [
            { id: "label", label: "Title", data_type: "STRING", field_type: "SHORTANS", type: "pure" },
            { id: "hrs", label: "Hours", data_type: "STRING", field_type: "SHORTANS", type: "pure" },
            { id: "start_at", label: "Start At", data_type: "STRING", field_type: "SHORTANS", type: "pure" },
            { id: "end_at", label: "End At", data_type: "STRING", field_type: "SHORTANS", type: "pure" },
        ],
        rows
    })
}