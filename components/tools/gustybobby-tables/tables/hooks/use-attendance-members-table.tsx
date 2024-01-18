"use client"

import type { AttendanceMembersTableInitializeState, UseAttendanceMembersTable } from "../../config-fetchers/config-types";
import Table from "@/server/classes/table";
import useDefaultGroupResponses from "../../config-fetchers/hooks/use-default-group-responses";
import { useEffect, useState } from "react";
import { extractTextFromResponseData } from "@/server/inputfunction";
import useMembersWithAttendance from "../../config-fetchers/hooks/use-members-with-attendance";
import { sectionStyles } from "@/components/styles/sections";

export default function useAttendanceMembersTable({ eventId, role, apptId, tableView, transformation }: UseAttendanceMembersTable){
    const { defaultGroups, defaultResponses, refetch: refetchGroupResponses } = useDefaultGroupResponses({ eventId, role, tableView })
    const { members, refetch: refetchMembers } = useMembersWithAttendance({ eventId, role, apptId })
    const [table, setTable] = useState<Table | 'loading' | 'error'>(initializeTable({
        groups: defaultGroups,
        defaultResponses,
        transformation,
        members,
    }))
    const [shouldRefetch, refetch] = useState({})
    useEffect(() => {
        refetchMembers({})
        refetchGroupResponses({})
    }, [shouldRefetch, refetchGroupResponses, refetchMembers])
    useEffect(() => {
        setTable(initializeTable({
            groups: defaultGroups,
            defaultResponses,
            transformation,
            members,
        }))
    }, [defaultGroups, defaultResponses, transformation, members])
    return { table, setTable, defaultGroups, refetch }
}

function initializeTable({
    groups,
    defaultResponses,
    members,
    transformation,
}: AttendanceMembersTableInitializeState){
    if(groups === 'loading' || defaultResponses === 'loading' || members === 'loading'){
        return 'loading'
    }
    if(groups === 'error' || defaultResponses === 'error' || members === 'error'){
        return 'error'
    }
    return Table.initialize({
        columns: [
            {
                type: 'pure',
                id: 'check_in_button',
                label: 'Check-in',
                data_type: 'STRING',
                field_type: 'SHORTANS'
            },
            {
                type: 'pure',
                id: 'check_out_button',
                label: 'Check-out',
                data_type: 'STRING',
                field_type: 'SHORTANS'
            },
            {
                type: 'pure',
                id: 'check_in',
                label: 'Time In',
                data_type: 'STRING',
                field_type: 'SHORTANS'
            },
            {
                type: 'pure',
                id: 'check_out',
                label: 'Time Out',
                data_type: 'STRING',
                field_type: 'SHORTANS'
            },
            {
                type: 'pure',
                id: 'role',
                label: 'Role',
                data_type: 'ROLE',
                field_type: 'OPTIONS',
            },
            {
                type: 'pure',
                id: 'position',
                label: 'Position',
                data_type: 'POSITION',
                field_type: 'OPTIONS',
            },
            ...groups,
        ],
        rows: members.map((member) => {
            return ({
                key: member.id,
                value: {
                    check_in_button: {
                        type: 'pure_single',
                        id: 'check_in_button',
                        raw_data: '',
                        data: (
                            <div className="flex justify-center">
                                <button className={sectionStyles.button({ color: 'green', hover: true, border: true  })}>
                                    C-in
                                </button>
                            </div>
                        )
                    },
                    check_out_button: {
                        type: 'pure_single',
                        id: 'check_out_button',
                        raw_data: '',
                        data: (
                            <div className="flex justify-center">
                                <button className={sectionStyles.button({ color: 'blue', hover: true, border: true  })}>
                                    C-out
                                </button>
                            </div>
                        )
                    },
                    check_in: {
                        type: 'pure_single',
                        id: 'check_in',
                        raw_data: member.attendance?.check_in ?? '',
                        data: member.attendance?.check_in ?? '-',
                    },
                    check_out: {
                        type: 'pure_single',
                        id: 'check_out',
                        raw_data: member.attendance?.check_out ?? '',
                        data: member.attendance?.check_out ?? '-',
                    },
                    position: {
                        type: 'pure_single',
                        id: 'position',
                        raw_data: member.position?.label ?? '',
                        data: member.position?.label ?? '',
                    },
                    role: {
                        type: 'pure_single',
                        id: 'role',
                        raw_data: member.role?.label ?? '',
                        data: member.role?.label ?? '',
                    },
                    ...Object.fromEntries(Object.entries(defaultResponses[member.id] ?? {}).map(([field_id, value]) => {
                        const group = groups.find((group) => group.id === field_id)
                        const fieldType = group?.type === 'pure'? group.field_type : 'SHORTANS'
                        return [
                            field_id, {
                                type: 'pure_single',
                                id: field_id,
                                data: extractTextFromResponseData(value, fieldType),
                            }
                        ]
                    }))
                }
            })
        }),
        transformation
    })
}