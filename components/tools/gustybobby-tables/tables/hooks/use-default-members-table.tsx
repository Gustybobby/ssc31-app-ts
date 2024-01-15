"use client"

import type { DefaultMembersTableInitializeState, UseDefaultMembersTable } from "../../config-fetchers/config-types";
import Table, { ColumnProperty } from "@/server/classes/table";
import useMembers from "../../config-fetchers/hooks/use-members";
import useDefaultGroupResponses from "../../config-fetchers/hooks/use-default-group-responses";

export default function useDefaultMembersTable({ eventId, role, options }: UseDefaultMembersTable){
    const { members } = useMembers({ eventId, role })
    const { defaultGroups, defaultResponses } = useDefaultGroupResponses({ eventId, role })
    
}

function initializeTable({ groups, responses, members, options }: DefaultMembersTableInitializeState){
    if(groups === 'loading' || responses === 'loading' || members === 'loading'){
        return 'loading'
    }
    if(groups === 'error' || responses === 'error' || members === 'error'){
        return 'error'
    }
    return Table.initialize({
        columns: [
            ...memberColumns(options)
        ],
        rows: responses.map((response) => {
            const member = members.find((member) => member.id === response.member_id)
            return {
                key: response.member_id,
                value: {
                    status: {
                        type: 'pure_single',
                        id: 'status',
                        data: member?.status ?? ''
                    },
                    position: {
                        type: 'pure_single',
                        id: 'position',
                        data: member?.position?.label ?? ''
                    },
                    role: {
                        type: 'pure_single',
                        id: 'role',
                        data: member?.role?.label ?? ''
                    }
                }
            }
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