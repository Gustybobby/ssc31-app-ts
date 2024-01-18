"use client"

import type { DefaultMembersTableInitializeState, UseDefaultMembersTable } from "../../config-fetchers/config-types";
import Table, { ColumnProperty } from "@/server/classes/table";
import useMembers from "../../config-fetchers/hooks/use-members";
import useDefaultGroupResponses from "../../config-fetchers/hooks/use-default-group-responses";
import { useEffect, useState } from "react";

export default function useDefaultMembersTable({ eventId, role, tableView, options }: UseDefaultMembersTable){
    const { members, refetch: refetchMembers } = useMembers({ eventId, role })
    const { defaultGroups, defaultResponses, refetch: refetchGroupResponses } = useDefaultGroupResponses({ eventId, role, tableView })
    const [table, setTable] = useState<Table | 'loading' | 'error'>(initializeTable({
        groups: defaultGroups,
        defaultResponses,
        members,
        options
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
            options
        }))
    }, [defaultGroups, defaultResponses, members, options])
    return { table, setTable, refetch }
}

function initializeTable({ groups, defaultResponses, members, options }: DefaultMembersTableInitializeState){
    if(groups === 'loading' || defaultResponses === 'loading' || members === 'loading'){
        return 'loading'
    }
    if(groups === 'error' || defaultResponses === 'error' || members === 'error'){
        return 'error'
    }
    return Table.initialize({
        columns: [
            ...memberColumns(options),
            ...groups,
        ],
        rows: members.map((member) => {
            return ({
                key: member.id,
                value: {
                    status: {
                        type: 'pure_single',
                        id: 'status',
                        raw_data: member.status ?? '',
                        data: member.status ?? '',
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
                    ...Object.fromEntries(Object.entries(defaultResponses[member.id] ?? {}).map(([field_id, value]) => [
                        field_id, {
                            type: 'pure_single',
                            id: field_id,
                            data: value,
                        }
                    ]))
                }
            })
        })
    })
}

function memberColumns(options: UseDefaultMembersTable['options']): ColumnProperty[]{
    return [
        {
            type: 'pure',
            id: 'status',
            label: 'Status',
            data_type: 'STRING',
            field_type: 'OPTIONS',
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
    ].filter((field) => {
        const fieldId = field.id as ('status' | 'position' | 'role')
        return !options?.columns || options.columns[fieldId]
    }) as ColumnProperty[]
}