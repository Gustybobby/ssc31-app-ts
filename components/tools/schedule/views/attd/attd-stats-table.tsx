import type { MemberWithAttendance } from "@/components/tools/gustybobby-tables/config-fetchers/config-types";
import { useState } from "react";

interface Statistics {
    by_position: {
        [key: string]: {
            checked_in: number
            total: number
        }
    }
    all: {
        checked_in: number
        total: number
    }
}

export default function AttdStatsTable({ members }: { members: MemberWithAttendance[] }){

    const [statistics, setStatistics] = useState<Statistics>(calculateStatistics(members))

    return (
        <div className="p-2 h-[80vh] overflow-auto">
            <table className="w-full">
                <thead>
                    <tr>
                        <th className={styles.headerCell}>
                            Position
                        </th>
                        <th className={styles.headerCell}>
                            Attendances
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(statistics.by_position).map(([label, { checked_in, total }], index) => (
                    <tr key={label+'_'+index}>
                        <td className={styles.rowCell(checked_in === total)}>
                            {label}
                        </td>
                        <td className={styles.rowCell(checked_in === total)}>
                            {checked_in} / {total}
                        </td>
                    </tr>
                    ))}
                    <tr key={"total_attend"} className="border-t-4">
                        <td className={styles.rowCell(statistics.all.checked_in === statistics.all.total)}>
                            Total
                        </td>
                        <td className={styles.rowCell(statistics.all.checked_in === statistics.all.total)}>
                        {statistics.all.checked_in} / {statistics.all.total}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

function calculateStatistics(members: MemberWithAttendance[]): Statistics{
    const stats: Statistics = { by_position: {}, all: { checked_in: 0, total: 0 }}
    for(const member of members){
        const key = member.position?.label ?? 'None'
        stats.by_position[key] = stats.by_position[key] ?? { checked_in: 0, total: 0 }
        stats.by_position[key].total++
        stats.all.total++
        if(member.attendance){
            stats.by_position[key].checked_in++
            stats.all.checked_in++
        }
    }
    return stats
}

const styles = {
    headerCell: [
        'p-2 overflow-auto font-bold',
        'border border-black dark:border-white',
        'bg-gray-200 dark:bg-gray-800',
    ].join(' '),
    rowCell: (full: boolean) => [
        'p-2',
        'border border-black dark:border-white',
        full? 'bg-green-400 dark:bg-green-600' :'bg-gray-100 dark:bg-gray-700',
    ].join(' '),
}