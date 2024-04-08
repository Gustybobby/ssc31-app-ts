"use client"

import { sectionStyles } from "@/components/styles/sections"
import useManageDistribution from "../../hooks/use-manage-distribution"
import ModeSelector from "./mode-selector"
import useDefaultGroupResponses from "@/components/tools/gustybobby-tables/config-fetchers/hooks/use-default-group-responses"
import { Fragment } from "react"
import GustybobbyTableLoading from "@/components/tools/gustybobby-tables/tables/gustybobby-table-loading"
import { sendDataToAPI } from "@/components/tools/api"
import toast from "react-hot-toast"

export default function ManageDistribution({ eventId, startAt, endAt }: {
    eventId: string,
    startAt: string,
    endAt: string,
}){

    const { distribution, mode, setMode, refetch } = useManageDistribution({ eventId, startAt, endAt })
    const { defaultGroups, defaultResponses } = useDefaultGroupResponses({ eventId, role: 'gustybobby', tableView: 'attd' })    

    if(defaultGroups === 'error' || defaultResponses === 'error' || distribution === 'error'){
        throw 'distribution fetching error'
    }
    return (
        <div className="min-h-60 space-y-2">
            {(defaultGroups === 'loading' || defaultResponses === 'loading')?
            <></>
            :
            <>
                <div className="flex items-center justify-between md:justify-start md:space-x-4">
                    <button
                        className={sectionStyles.button({ color: 'pink', hover: true, border: true })}
                        onClick={() => refetch({})}
                    >
                        Summarize
                    </button>
                    <ModeSelector mode={mode} setMode={setMode}/>
                </div>
                <div className="w-full overflow-auto max-h-screen">
                    {distribution === 'stasis'?
                    <></>
                    :
                    <>
                        {distribution === 'loading'?
                        <GustybobbyTableLoading/>
                        :
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className={styles.headerCell('w-16')}>
                                        Add
                                    </th>
                                    {defaultGroups.map((group) => (
                                    <th key={group.id} className={styles.headerCell()}>
                                        {group.label}
                                    </th>
                                    ))}
                                    <th className={styles.headerCell('w-32')}>
                                        Total Hours
                                    </th>
                                    <th className={styles.headerCell('w-96')}>
                                        Title
                                    </th>
                                    <th className={styles.headerCell('w-32')}>
                                        Hours
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(distribution).map(([member_id, dist]) => (
                                <Fragment key={member_id+'_ROW'}>
                                    <tr>
                                        <td rowSpan={dist.length+1} className={styles.rowCell}>
                                            <div className="flex justify-center">
                                                <button
                                                    className={sectionStyles.button({
                                                        color: "green",
                                                        hover: true,
                                                        border: true,
                                                        padding: "px-4 py-2"
                                                    })}
                                                    onClick={async() => {
                                                        const addingToast = toast.loading("Adding Records...")
                                                        await sendDataToAPI({
                                                            apiUrl: `/api/gustybobby/events/${eventId}/members/${member_id}/hours/activity`,
                                                            method: 'POST',
                                                            body: JSON.stringify({ data: dist })
                                                        })
                                                        toast.success("Added Records", { id: addingToast })
                                                    }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        {defaultGroups.map((group) => (
                                        <td key={group.id} className={styles.rowCell} rowSpan={dist.length+1}>
                                            {defaultResponses[member_id][group.id]}
                                        </td>
                                        ))}
                                        <td rowSpan={dist.length+1} className={styles.rowCell}>
                                            {dist.reduce((sum, curr) => sum + curr.hrs, 0).toFixed(2)}
                                        </td>
                                    </tr>
                                    {dist.map((record) => (
                                    <tr key={member_id+'_'+record.appt_id+'_ROW_SECTION'}>
                                        <td className={styles.rowCell}>
                                            {record.label}
                                        </td>
                                        <td className={styles.rowCell}>
                                            {record.hrs.toFixed(2)}
                                        </td>
                                    </tr>
                                    ))}
                                </Fragment>
                                ))}
                            </tbody>
                        </table>
                        }
                    </>
                    }
                </div>
            </>
            }
        </div>
    )
}

const styles = {
    headerCell: (width?: string) => [
        'p-2',
        'bg-gray-200 dark:bg-gray-800',
        'border border-black dark:border-white',
        width,
    ].join(' '),
    rowCell: [
        'p-2',
        'bg-gray-100 dark:bg-gray-700',
        'border border-black dark:border-white',
    ].join(' '),
}