"use client"

import type { AttendanceMembersTableInitializeState, UseAppointmentMembersTable } from "../../config-fetchers/config-types";
import Table from "@/server/classes/table";
import useDefaultGroupResponses from "../../config-fetchers/hooks/use-default-group-responses";
import { useEffect, useState } from "react";
import { extractTextFromResponseData } from "@/server/inputfunction";
import useAppointmentMembers from "../../config-fetchers/hooks/use-appointment-members";
import { memberColumns } from "../../config-fetchers/columns";
import CheckInButton from "./rendered-components/check-in-button";
import CheckOutButton from "./rendered-components/check-out-button";

export default function useAttendanceMembersTable({ eventId, role, apptId, tableView, transformation }: UseAppointmentMembersTable){
    const { defaultGroups, defaultResponses, refetch: refetchGroupResponses } = useDefaultGroupResponses({ eventId, role, tableView, apptId })
    const { members, refetch: refetchMembers } = useAppointmentMembers({ eventId, role, apptId })
    const [shouldRefetch, refetch] = useState({})
    const [table, setTable] = useState<Table | 'loading' | 'error'>(initializeTable({
        groups: defaultGroups,
        defaultResponses,
        transformation,
        members,
        role,
        apptId,
        eventId,
        refetch,
    }))
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
            role,
            apptId,
            eventId,
            refetch,
        }))
    }, [defaultGroups, defaultResponses, transformation, members, role, apptId, eventId, refetch])
    return { table, setTable, defaultGroups, refetch }
}

function initializeTable({
    groups,
    defaultResponses,
    members,
    transformation,
    role,
    apptId,
    eventId,
    refetch,
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
            ...memberColumns,
            ...groups,
        ],
        rows: members.map((member) => {
            const attendanceExisted = !!member.attendance
            const checkInExisted = !!member.attendance?.check_in
            const checkOutExisted = !!member.attendance?.check_out
            return ({
                key: member.id,
                value: {
                    check_in_button: {
                        type: 'pure_single',
                        id: 'check_in_button',
                        raw_data: '',
                        data: (
                            <CheckInButton
                                attendanceExisted={attendanceExisted}
                                checkInExisted={checkInExisted}
                                eventId={eventId}
                                memberId={member.id}
                                apptId={apptId}
                                role={role}
                                refetch={refetch}
                            />
                        )
                    },
                    check_out_button: {
                        type: 'pure_single',
                        id: 'check_out_button',
                        raw_data: '',
                        data: (
                            <CheckOutButton
                                attendanceExisted={attendanceExisted}
                                checkOutExisted={checkOutExisted}
                                eventId={eventId}
                                memberId={member.id}
                                apptId={apptId}
                                role={role}
                                refetch={refetch}
                            />
                        )
                    },
                    check_in: {
                        type: 'pure_single',
                        id: 'check_in',
                        raw_data: formatDate(member.attendance?.check_in),
                        data: formatDate(member.attendance?.check_in),
                    },
                    check_out: {
                        type: 'pure_single',
                        id: 'check_out',
                        raw_data: formatDate(member.attendance?.check_out),
                        data: formatDate(member.attendance?.check_out),
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

function formatDate(isoString: string | null | undefined){
    return isoString? (new Date(isoString)).toLocaleString() : '-'
}