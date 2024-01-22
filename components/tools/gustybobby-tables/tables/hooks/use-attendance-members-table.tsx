"use client"

import type { AttendanceMembersTableInitializeState, UseAppointmentMembersTable } from "../../config-fetchers/config-types";
import Table from "@/server/classes/table";
import useDefaultGroupResponses from "../../config-fetchers/hooks/use-default-group-responses";
import { useEffect, useState } from "react";
import { extractTextFromResponseData } from "@/server/inputfunction";
import { sectionStyles } from "@/components/styles/sections";
import { sendDataToAPI } from "@/components/tools/api";
import { attendancesApiUrl } from "../../config-fetchers/config-urls";
import toast from "react-hot-toast";
import useAppointmentMembers from "../../config-fetchers/hooks/use-appointment-members";
import { memberColumns } from "../../config-fetchers/columns";

export default function useAttendanceMembersTable({ eventId, role, apptId, tableView, transformation }: UseAppointmentMembersTable){
    const { defaultGroups, defaultResponses, refetch: refetchGroupResponses } = useDefaultGroupResponses({ eventId, role, tableView })
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
                            <div className="flex justify-center">
                                <button
                                    className={sectionStyles.button({
                                        color: checkInExisted? 'red' : 'green',
                                        hover: true,
                                        border: true
                                    })}
                                    onClick={async() => {
                                        const checkInToast = toast.loading(checkInExisted? 'Canceling...' : 'Checking in...')
                                        await sendDataToAPI({
                                            apiUrl: attendancesApiUrl({ eventId, role, apptId, memberId: member.id }),
                                            method: attendanceExisted? 'PATCH' : 'POST',
                                            body: JSON.stringify({
                                                data: {
                                                    member_id: member.id,
                                                    appointment_id: apptId,
                                                    check_in: checkInExisted? null : new Date(),
                                                }
                                            })
                                        })
                                        toast.success(checkInExisted? 'Canceled' : 'Checked in', { id: checkInToast })
                                        refetch({})
                                    }}
                                >
                                    {checkInExisted? 'Cancel' : 'C-in'}
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
                                <button
                                    className={sectionStyles.button({
                                        color: checkOutExisted? 'red' : 'blue',
                                        hover: true,
                                        border: true
                                    })}
                                    onClick={async() => {
                                        const checkOutToast = toast.loading(checkOutExisted?  'Canceling...' : 'Checking out...')
                                        await sendDataToAPI({
                                            apiUrl: attendancesApiUrl({ eventId, role, apptId, memberId: member.id }),
                                            method: attendanceExisted? 'PATCH' : 'POST',
                                            body: JSON.stringify({
                                                data: {
                                                    member_id: member.id,
                                                    appointment_id: apptId,
                                                    check_out: checkOutExisted? null : new Date(),
                                                }
                                            })
                                        })
                                        toast.success(checkOutExisted? 'Canceled' : 'Checked out', { id: checkOutToast })
                                        refetch({})
                                    }}
                                >
                                    {checkOutExisted? 'Cancel' : 'C-out'}
                                </button>
                            </div>
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