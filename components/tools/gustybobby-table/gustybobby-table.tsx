"use client"

import Table, { exampleColumns } from "@/server/classes/table"

export default function GustybobbyTable(){

    const table = Table.initialize({ columns: exampleColumns, rows: [] })
    console.log(table.columns)
    return (
        <div className="w-full overflow-auto">
            <table className="tabled-fixed w-full">
                <thead>
                    {table.getColumnsTableRows().map((columns, index) => (
                    <tr key={index}>
                        {columns.map((column) => (
                            <th
                                key={column.id}
                                rowSpan={column.row_span}
                                colSpan={column.col_span}
                                className="border p-2"
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                    ))}
                </thead>
            </table>
        </div>
    )
}