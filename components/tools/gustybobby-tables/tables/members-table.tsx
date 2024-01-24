"use client"

import type Table from "@/server/classes/table"
import Link from "next/link"
import type { Dispatch, SetStateAction } from "react"
import { FaSort, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa"

type SetTransformation = Dispatch<SetStateAction<Table['transformation']>>

export default function MembersTable({
    table,
    headerCellClassName,
    transformation,
    setTransformation,
    bottomSpacing,
}: {
    table: Table,
    headerCellClassName: string
    transformation?: Table['transformation']
    setTransformation?: SetTransformation
    bottomSpacing?: string
}){
    return (
        <div className="w-full overflow-x-auto">
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
                                    <span>{column.label}</span>
                                    {column.type === 'pure' && transformation && setTransformation &&
                                    <SortButton
                                        transformation={transformation}
                                        setTransformation={setTransformation}
                                        column_id={column.id}
                                    />
                                    }
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
            {bottomSpacing && <div className={bottomSpacing}/>}
        </div>
    )
}

function SortButton({ transformation, setTransformation, column_id }: {
    transformation: Table['transformation']
    setTransformation: SetTransformation
    column_id: string
}){
    const sort = transformation?.sorts?.find((sort) => sort.column_id === column_id)
    if(!sort){
        return (
            <button
                onClick={() => {
                    setTransformation(transformation => ({
                        ...transformation,
                        sorts: [
                            ...(transformation?.sorts ?? []),
                            { column_id, direction: 'asc' },
                        ]
                    }))
                }}
            >
                <FaSort/>
            </button>
        )
    }
    if(sort.direction === 'asc'){
        return (
            <button 
                onClick={() => {
                    setTransformation(transformation => ({
                        ...transformation,
                        sorts: [
                            ...(transformation?.sorts ?? []).filter((sort) => sort.column_id !== column_id),
                            { column_id, direction: 'desc' },
                        ]
                    }))
                }}
            >
                <FaSortAmountUp/>
            </button>
        )
    }
    return (
        <button 
            onClick={() => {
                setTransformation(transformation => ({
                    ...transformation,
                    sorts: [
                        ...(transformation?.sorts ?? []).filter((sort) => sort.column_id !== column_id),
                        { column_id, direction: 'asc' },
                    ]
                }))
            }}
        >
            <FaSortAmountDown/>
        </button>
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