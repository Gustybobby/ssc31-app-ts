"use client"

import Table, { exampleColumns, exampleRows } from "@/server/classes/table"

export default function GustybobbyTable(){

    const table = Table.initialize({ columns: exampleColumns, rows: exampleRows })
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
                <tbody>
                    {table.getRowsTableRows().map((row) => (
                    <tr key={row.key}>
                        {row.value.map((row) => (
                            <td key={row.id} rowSpan={row.row_span ?? 1} className="border p-2">
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