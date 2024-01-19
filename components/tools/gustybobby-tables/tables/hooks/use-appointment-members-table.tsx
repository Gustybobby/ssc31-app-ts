"use client"

import type { AppointmentMembersTableInitializeState, UseAppointmentMembersTable } from "../../config-fetchers/config-types";
import Table, { type ColumnProperty } from "@/server/classes/table";
import useDefaultGroupResponses from "../../config-fetchers/hooks/use-default-group-responses";
import { useEffect, useState } from "react";
import useAppointmentMembers from "../../config-fetchers/hooks/use-appointment-members";
import { extractTextFromResponseData } from "@/server/inputfunction";

export default function useAppointmentMembersTable({ eventId, role, tableView, apptId, transformation }: UseAppointmentMembersTable){
    const { members, refetch: refetchMembers } = useAppointmentMembers({ eventId, role, apptId })
    const { defaultGroups, defaultResponses, refetch: refetchGroupResponses } = useDefaultGroupResponses({ eventId, role, tableView })
    const [table, setTable] = useState<Table | 'loading' | 'error'>(initializeTable({
        groups: defaultGroups,
        defaultResponses,
        members,
        transformation
    }))
    const [shouldRefetch, refetch] = useState({})
    useEffect(() => {
        refetchMembers({})
        refetchGroupResponses({})
    }, [shouldRefetch, refetchMembers, refetchGroupResponses])
    useEffect(() => {
        setTable(initializeTable({
            groups: defaultGroups,
            defaultResponses,
            members,
            transformation
        }))
    }, [defaultGroups, defaultResponses, members, transformation])
    return { table, setTable, refetch }
}

function initializeTable({ groups, defaultResponses, members, transformation }: AppointmentMembersTableInitializeState){
    if(groups === 'loading' || defaultResponses === 'loading' || members === 'loading'){
        return 'loading'
    }
    if(groups === 'error' || defaultResponses === 'error' || members === 'error'){
        return 'error'
    }
    return Table.initialize({
        columns: [
            ...memberColumns,
            ...groups,
        ],
        rows: members.map((member) => {
            return ({
                key: member.id,
                value: {
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
                    ...Object.fromEntries(groups.map((group) => {
                        const response = defaultResponses[member.id]?.[group.id]
                        const fieldType = group.type === 'pure'? group.field_type : 'SHORTANS'
                        const extractedResponse = extractTextFromResponseData(response ?? '', fieldType)
                        return [
                            [group.id], {
                                type: 'pure_single',
                                id: group.id,
                                raw_data: extractedResponse,
                                data: extractedResponse,
                            }
                        ]
                    }))
                }
            })
        }),
        transformation
    })
}

const memberColumns: ColumnProperty[] = [
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
]