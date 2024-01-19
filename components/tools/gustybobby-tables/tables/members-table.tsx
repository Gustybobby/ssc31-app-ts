"use client"

import Table from "@/server/classes/table"
import Link from "next/link"

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
                                className={styles.headerCell}
                            >
                                <div className={column.id === 'index'? 'w-16' : headerCellClassName}>
                                    {column.label}
                                </div>
                            </th>
                        ))}
                    </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowsTableRows().map((row) => (
                    <tr key={row.key}>
                        {row.value.map((row) => {
                            return(
                                <td key={row.id} rowSpan={row.row_span ?? 1} className={styles.rowCell}>
                                    {(row.data.toString().includes(':') && row.data.toString().includes('.'))?
                                    <Link
                                        href={row.data.toString()}
                                        target="_blank"
                                        className="text-blue-600 dark:text-blue-400 underline"
                                    >
                                        {row.data}
                                    </Link>
                                    :
                                    <>{row.data}</>
                                    }
                                </td>
                            )
                        })}
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

const styles = {
    headerCell: [
        'p-2 overflow-auto',
        'border border-black dark:border-white',
        'bg-gray-200 dark:bg-gray-800',
    ].join(' '),
    rowCell: [
        'p-2',
        'border border-black dark:border-white',
        'bg-gray-100 dark:bg-gray-700',
    ].join(' '),
}