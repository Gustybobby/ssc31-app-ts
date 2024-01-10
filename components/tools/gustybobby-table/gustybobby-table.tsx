"use client"

import Table, { type RowProperty } from "@/server/classes/table"
import { useEffect, useState } from "react"

export default function GustybobbyTable(){

    const [table, setTable] = useState<Table>()

    useEffect(() => {
        fetch(`/api/gustybobby/events/clr6ipi700001130dsv4u78xo/forms/clr6ixmeg000p130d8grtvfsx?id=1&title=1&field_order=1&form_fields=1`)
            .then(res => res.json())
            .then(data => data.data)
            .then((form_config: any) => {
                fetch(`/api/gustybobby/events/clr6ipi700001130dsv4u78xo/forms/clr6ixmeg000p130d8grtvfsx/responses`)
                    .then(res => res.json())
                    .then(data => data.data)
                    .then((responses: any) => {
                        const rows: RowProperty[] = []
                        for(const response of responses){
                            rows.push(Table.formResponseAdapter(response, form_config))
                        }
                        setTable(Table.initialize({ columns: [Table.formColumnAdapter(form_config)], rows }))
                    })
                    
            })
    },[])

    if(!table){
        return <></>
    }

    return (
        <div className="w-full overflow-auto">
            <table className="table-fixed min-w-full">
                <thead>
                    {table.getColumnsTableRows().map((columns, index) => (
                    <tr key={index}>
                        {columns.map((column) => (
                            <th
                                key={column.id}
                                rowSpan={column.row_span}
                                colSpan={column.col_span}
                                className="border border-black dark:border-white p-2 overflow-auto bg-gray-200 dark:bg-gray-800"
                            >
                                <div className="min-w-48">{column.label}</div>
                            </th>
                        ))}
                    </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowsTableRows().map((row) => (
                    <tr key={row.key}>
                        {row.value.map((row) => (
                            <td key={row.id} rowSpan={row.row_span ?? 1} className="border border-black dark:border-white p-2 bg-gray-100 dark:bg-gray-700">
                                {row.data}
                            </td>
                        ))}
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}