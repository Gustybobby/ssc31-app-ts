"use client"

import type { SelectableMembersTableInitiializeState, UseSelectableMembersTable } from "../../config-fetchers/config-types";
import Table from "@/server/classes/table";
import useMembers from "../../config-fetchers/hooks/use-members";
import useDefaultGroupResponses from "../../config-fetchers/hooks/use-default-group-responses";
import { useEffect, useState } from "react";

export default function useSelectableMembersTable({ eventId, role, selection }: UseSelectableMembersTable){
    const { members, refetch: refetchMembers } = useMembers({ eventId, role })
    const { defaultGroups, defaultResponses, refetch: refetchGroupResponses } = useDefaultGroupResponses({ eventId, role })
    const [memberSelects, setMemberSelects] = useState(selection)
    const [table, setTable] = useState<Table | 'loading' | 'error'>(initializeTable({
        groups: defaultGroups,
        defaultResponses,
        members,
        memberSelects,
        setMemberSelects,
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
            memberSelects,
            setMemberSelects,
        }))
    }, [defaultGroups, defaultResponses, members, memberSelects])
    return { table, setTable, memberSelects, setMemberSelects, refetch }
}

function initializeTable({ groups, defaultResponses, members, memberSelects, setMemberSelects }: SelectableMembersTableInitiializeState){
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
                id: 'select',
                label: 'Select',
                data_type: 'STRING',
                field_type: 'SHORTANS',
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
                    select: {
                        type: 'pure_single',
                        id: 'select',
                        data: (
                            <div className="w-full flex justify-center">
                                <input
                                    type="checkbox"
                                    defaultChecked={!!memberSelects?.[member.id]}
                                    onChange={(e) => {
                                        setMemberSelects(memberSelects => ({
                                            ...memberSelects,
                                            [member.id]: e.target.checked,
                                        }))
                                    }}
                                />
                            </div>
                        )
                    },
                    position: {
                        type: 'pure_single',
                        id: 'position',
                        data: member.position?.label ?? ''
                    },
                    role: {
                        type: 'pure_single',
                        id: 'role',
                        data: member.role?.label ?? ''
                    },
                    ...Object.fromEntries(Object.entries(defaultResponses[member.id]).map(([field_id, value]) => [
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