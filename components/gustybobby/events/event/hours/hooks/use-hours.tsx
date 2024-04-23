"use client"

import { transferableSems } from "@/components/profile/events/event/hours/scholarship-hours/scholarship"
import type { DefaultResponsesState, GroupsState, Member, MembersState } from "@/components/tools/gustybobby-tables/config-fetchers/config-types"
import useDefaultGroupResponses from "@/components/tools/gustybobby-tables/config-fetchers/hooks/use-default-group-responses"
import Table, { type ColumnProperty } from "@/server/classes/table"
import { extractTextFromResponseData } from "@/server/inputfunction"
import type { StudentMember, TransferRecord } from "@/server/typeconfig/record"
import { useEffect, useState } from "react"

export default function useHours({ eventId, eventCreatedAt, members, activityHours, transferRecords }: {
    eventId: string
    eventCreatedAt: Date
    members: StudentMember[]
    activityHours: { [member_id: string]: number }
    transferRecords: { [member_id: string]: { [key: string]: TransferRecord }}
}){
    const { defaultResponses, defaultGroups } = useDefaultGroupResponses({ eventId, role: "gustybobby", tableView: "attd" })
    const [transformation, setTransformation] = useState<Table['transformation']>({})
    const [actTable, setActTable] = useState<Table | 'loading' | 'error'>(initializeActTable({
        groups: defaultGroups,
        defaultResponses,
        members,
        transformation,
        activityHours,
    }))
    const [scholTable, setScholTable] = useState<Table | 'loading' | 'error'>(initializeScholTable({
        groups: defaultGroups,
        defaultResponses,
        members,
        transformation,
        transferRecords,
        eventCreatedAt,
    }))
    useEffect(() => {
        setActTable(initializeActTable({
            groups: defaultGroups,
            defaultResponses,
            members,
            transformation,
            activityHours,
        }))
        setScholTable(initializeScholTable({
            groups: defaultGroups,
            defaultResponses,
            members,
            transformation,
            transferRecords,
            eventCreatedAt,
        }))
    }, [defaultGroups, defaultResponses, members, transformation, activityHours, transferRecords, eventCreatedAt])
    return { transformation, setTransformation, actTable, scholTable }
}

interface ActivityHoursTableInitializeState {
    groups: GroupsState
    defaultResponses: DefaultResponsesState
    members: StudentMember[]
    transformation?: Table["transformation"]
    activityHours: { [member_id: string]: number }
}

function initializeActTable({ groups, defaultResponses, members, transformation, activityHours }: ActivityHoursTableInitializeState){
    if(groups === 'loading' || defaultResponses === 'loading'){
        return 'loading'
    }
    if(groups === 'error' || defaultResponses === 'error'){
        return 'error'
    }
    return Table.initialize({
        columns: [
            ...memberColumns,
            ...groups,
            {
                type: 'pure',
                id: 'act_hrs',
                label: 'Activity Hours',
                data_type: 'NUM',
                field_type: 'SHORTANS',
            },
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
                    student_id: {
                        type: 'pure_single',
                        id: 'student_id',
                        raw_data: member.student_id,
                        data: member.student_id,
                    },
                    ...Object.fromEntries(groups.map((group) => {
                        const response = defaultResponses[member?.id ?? '']?.[group.id]
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
                    })),
                    act_hrs: {
                        type: 'pure_single',
                        id: 'act_hrs',
                        raw_data: (activityHours[member.id] ?? 0).toFixed(0),
                        data: (activityHours[member.id] ?? 0).toFixed(0),
                    },
                }
            })
        }),
        transformation,
    })
}

interface ScholHoursTableInitializeState {
    groups: GroupsState
    defaultResponses: DefaultResponsesState
    members: StudentMember[]
    transformation?: Table["transformation"]
    eventCreatedAt: Date
    transferRecords: { [member_id: string]: { [key: string]: TransferRecord }}
}

function initializeScholTable({ groups, defaultResponses, members, transformation, eventCreatedAt, transferRecords }: ScholHoursTableInitializeState){
    if(groups === 'loading' || defaultResponses === 'loading'){
        return 'loading'
    }
    if(groups === 'error' || defaultResponses === 'error'){
        return 'error'
    }
    const semYears = transferableSems(eventCreatedAt)
    const scholMembers = members.filter((member) => !!transferRecords[member.id] && Object.keys(transferRecords[member.id]).length !== 0)
    return Table.initialize({
        columns: [
            ...memberColumns,
            ...groups,
            ...semYears.map(([sem, year]) => ({
                type: 'pure',
                id: `${sem}_${year}`,
                label: `${sem}/${year}`,
                data_type: 'STRING',
                field_type: 'SHORTANS',
            })) as ColumnProperty[]
        ],
        rows: scholMembers.map((member) => {
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
                    student_id: {
                        type: 'pure_single',
                        id: 'student_id',
                        raw_data: member.student_id,
                        data: member.student_id,
                    },
                    ...Object.fromEntries(groups.map((group) => {
                        const response = defaultResponses[member?.id ?? '']?.[group.id]
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
                    })),
                    ...Object.fromEntries(semYears.map(([sem, year]) => [
                        `${sem}_${year}`,
                        {
                            type: 'pure_single',
                            id: `${sem}_${year}`,
                            raw_data: transferRecords[member.id][`${sem}_${year}`]?.hrs ?? '',
                            data: transferRecords[member.id][`${sem}_${year}`]?.hrs ?? '',
                        }
                    ]))
                }
            })
        }),
        transformation,
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
    {
        type: 'pure',
        id: 'student_id',
        label: 'Student ID',
        data_type: 'STRING',
        field_type: 'SHORTANS',
    },
]