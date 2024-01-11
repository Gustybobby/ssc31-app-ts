"use client"

import type { StaticMembersTableState } from "../config-fetchers/config-types"
import useStaticMembersTable from "./hooks/use-static-members-table"

export default function StaticMembersTable({ formConfig, responses, members }: StaticMembersTableState){

    const table = useStaticMembersTable({ formConfig, responses, members })

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