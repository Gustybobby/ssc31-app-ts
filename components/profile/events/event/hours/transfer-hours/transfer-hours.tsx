"use client"

import { sectionStyles } from "@/components/styles/sections"
import type { TransferRecord } from "@/server/typeconfig/record"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function TransferHours({ transferRecords }: {
    transferRecords: { [key: string]: TransferRecord }
}){
    const [records, setRecords] = useState(sortedRecords(transferRecords))
    const pathname = usePathname()

    return (
        <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
            <h1 className={sectionStyles.title({ color: 'green', extensions: 'mb-2' })}>Scholarship Hours</h1>
            <Link
                href={pathname+'/scholarship'}
                className={sectionStyles.button({ color: "blue", border: true, hover: true, padding: "px-2 py-1", extensions: "mb-2" })}
            >
                Transfer Hours
            </Link>
            <table className="table-fixed min-w-full">
                <thead>
                    <tr>
                        <th className={styles.headerCell}>Academic Year</th>
                        <th className={styles.headerCell}>Semester</th>
                        <th className={styles.headerCell}>Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {records.length > 0?
                    <>
                        {records.map((record,index) => (
                        <tr key={`SCHOL_${index}`}>
                            <td className={styles.rowCell}>
                                {record.year}
                            </td>
                            <td className={styles.rowCell}>
                                {record.semester}
                            </td>
                            <td className={styles.rowCell}>
                                {record.hrs}
                            </td>
                        </tr>
                        ))}
                    </>
                    :
                    <tr>
                        <td className={styles.rowCell+" text-center"} colSpan={3}>
                            No transfer record
                        </td>
                    </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}

const sortedRecords = (transferRecords: { [key: string]: TransferRecord }) => {
    const records: TransferRecord[] = Object.values(transferRecords)
    records.sort((a,b) => a.semester+a.year*2 - b.semester-b.year*2)
    return records
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