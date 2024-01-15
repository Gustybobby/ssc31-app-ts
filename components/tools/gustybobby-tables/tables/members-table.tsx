"use client"

import Table from "@/server/classes/table"

export default function MembersTable({ table, headerCellClassName }: { table: Table, headerCellClassName: string }){
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
                                <div className={headerCellClassName}>{column.label}</div>
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