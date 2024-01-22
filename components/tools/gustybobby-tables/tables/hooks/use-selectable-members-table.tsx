"use client"

import type { SelectableMembersTableInitiializeState, UseSelectableMembersTable } from "../../config-fetchers/config-types";
import Table from "@/server/classes/table";
import useMembers from "../../config-fetchers/hooks/use-members";
import useDefaultGroupResponses from "../../config-fetchers/hooks/use-default-group-responses";
import { useEffect, useState } from "react";
import { extractTextFromResponseData } from "@/server/inputfunction";
import { memberColumns } from "../../config-fetchers/columns";

export default function useSelectableMembersTable({ eventId, role, tableView, selection, transformation }: UseSelectableMembersTable){
    const { members, refetch: refetchMembers } = useMembers({ eventId, role })
    const { defaultGroups, defaultResponses, refetch: refetchGroupResponses } = useDefaultGroupResponses({ eventId, role, tableView })
    const [memberSelects, setMemberSelects] = useState(selection)
    const [table, setTable] = useState<Table | 'loading' | 'error'>(initializeTable({
        groups: defaultGroups,
        defaultResponses,
        members,
        memberSelects,
        setMemberSelects,
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
            memberSelects,
            setMemberSelects,
            transformation
        }))
    }, [defaultGroups, defaultResponses, members, memberSelects, transformation])
    return { table, setTable, memberSelects, setMemberSelects, defaultGroups, refetch }
}

function initializeTable({
    groups,
    defaultResponses,
    members,
    memberSelects,
    setMemberSelects,
    transformation,
}: SelectableMembersTableInitiializeState){
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
            ...memberColumns,
            ...groups,
        ],
        rows: members.map((member) => {
            return ({
                key: member.id,
                value: {
                    select: {
                        type: 'pure_single',
                        id: 'select',
                        raw_data: '',
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