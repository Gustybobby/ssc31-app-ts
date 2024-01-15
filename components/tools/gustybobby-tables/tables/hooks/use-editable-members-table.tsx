"use client"

import Table from "@/server/classes/table";
import { ListBoxSingleSelect } from "@/components/tools/list-box";
import { EventConfigState, FormConfigState, FormTableConfig, MembersState, ResponsesState, statusOptions } from "../../config-fetchers/config-types";
import useFormConfig from "../../config-fetchers/hooks/use-form-config";
import useResponses from "../../config-fetchers/hooks/use-responses";
import useMembers from "../../config-fetchers/hooks/use-members";
import { type MutableRefObject, useState, useEffect, type Dispatch, type SetStateAction } from "react";
import useEventConfig from "../../config-fetchers/hooks/use-event-config";

export interface UseEditableMembersTableProps extends FormTableConfig{
    editRef: MutableRefObject<{ [key: string]: { [key: string]: string }}>
}

export default function useEditableMembersTable({ eventId, formId, role, editRef }: UseEditableMembersTableProps){
    const { formConfig, refetch: refetchFormConfig } = useFormConfig({ eventId, formId, role })
    const { eventConfig, refetch: refetchEventConfig } = useEventConfig({ eventId, role })
    const { responses, refetch: refetchResponses } = useResponses({ eventId, formId, role })
    const { members, setMembers, refetch: refetchMembers } = useMembers({ eventId, role })
    const [table, setTable] = useState<Table | 'loading' | 'error'>(initializeTable({
        formConfig,
        eventConfig,
        responses,
        setMembers,
        members,
        editRef
    }))
    const [shouldRefetch, refetch] = useState({})
    useEffect(() => {
        refetchFormConfig({})
        refetchEventConfig({})
        refetchResponses({})
        refetchMembers({})
    }, [shouldRefetch, refetchFormConfig, refetchEventConfig, refetchResponses, refetchMembers])
    useEffect(() => {
        setTable(initializeTable({
            formConfig,
            eventConfig,
            responses,
            setMembers,
            members,
            editRef
        }))
    }, [formConfig, eventConfig, responses, members, editRef, setMembers])
    return { table, refetch }
}

interface InitializeTable {
    formConfig: FormConfigState
    eventConfig: EventConfigState
    responses: ResponsesState
    members: MembersState
    editRef: UseEditableMembersTableProps['editRef']
    setMembers: Dispatch<SetStateAction<MembersState>>
}

function initializeTable({ formConfig, eventConfig, responses, members, editRef, setMembers }: InitializeTable){
    if(formConfig === 'loading' || eventConfig === 'loading' || responses === 'loading' || members === 'loading'){
        return 'loading'
    }
    if(formConfig === 'error' || eventConfig === 'error' || responses === 'error' || members === 'error'){
        return 'error'
    }
    return Table.initialize({
        columns: [
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
            Table.formColumnAdapter(formConfig)
        ],
        rows: responses.map((response) => {
            const member = members.find((member) => member.id === response.member_id)
            return {
                key: response.member_id,
                value: {
                    ...Table.formResponseAdapter(response, formConfig, { reference_key: 'member_id' }).value,
                    status: {
                        type: 'pure_single',
                        id: 'status',
                        data: (
                            <ListBoxSingleSelect
                                list={statusOptions.map((option) => ({ ...option, active: option.id === member?.status }))}
                                setList={(list) => {
                                    const selectedStatus = list.find((option) => option.active).id
                                    const memberId = member?.id ?? ''
                                    editRef.current = {
                                        ...editRef.current,
                                        [memberId]: {
                                            ...editRef.current[memberId],
                                            status: selectedStatus
                                        }
                                    }
                                    setMembers(members => {
                                        if(members === 'loading' || members === 'error'){
                                            throw 'cannot set members during loading or error'
                                        }
                                        return members.map((member)=>({
                                            ...member,
                                            status: member.id === memberId? selectedStatus : member.status,
                                        }))
                                    })
                                }}
                                width="w-32"
                                maxHeight=""
                            />
                        )
                    },
                    position: {
                        type: 'pure_single',
                        id: 'position',
                        data: (
                            <ListBoxSingleSelect
                                list={eventConfig.positions.map((position, index) => ({
                                    id: position.id ?? 'MISSING_ID',
                                    label: position.label ?? 'MISSING_LABEL',
                                    index,
                                    active: position.id === member?.position?.id
                                })).concat({
                                    id: 'NONE',
                                    label: 'None',
                                    index: eventConfig.positions.length,
                                    active: (member?.position?.id ?? 'NONE') === 'NONE'
                                })}
                                setList={(list) => {
                                    const selectedPositionId = list.find((option) => option.active).id as string
                                    const memberId = member?.id ?? ''
                                    editRef.current = {
                                        ...editRef.current,
                                        [memberId]: {
                                            ...editRef.current[memberId],
                                            position_id: selectedPositionId
                                        }
                                    }
                                    setMembers(members => {
                                        if(members === 'loading' || members === 'error'){
                                            throw 'cannot set members during loading or error'
                                        }
                                        return members.map((member)=>({
                                            ...member,
                                            position: member.id === memberId? {
                                                id: selectedPositionId,
                                                label: eventConfig.positions.find((position) => position.id === selectedPositionId)
                                                    ?.label ?? 'MISSING_LABEL'
                                            }: member.position,
                                        }))
                                    })
                                }}
                                width="w-32"
                                maxHeight="max-h-40"
                            />
                        )
                    },
                    role: {
                        type: 'pure_single',
                        id: 'role',
                        data: (
                            <ListBoxSingleSelect
                                list={eventConfig.roles.map((role, index) => ({
                                    id: role.id ?? 'MISSING_ID',
                                    label: role.label ?? 'MISSING_LABEL',
                                    index,
                                    active: role.id === member?.role?.id
                                })).concat({
                                    id: 'NONE',
                                    label: 'None',
                                    index: eventConfig.roles.length,
                                    active: (member?.role?.id ?? 'NONE') === 'NONE'
                                })}
                                setList={(list) => {
                                    const selectedRoleId = list.find((option) => option.active).id as string
                                    const memberId = member?.id ?? ''
                                    editRef.current = {
                                        ...editRef.current,
                                        [memberId]: {
                                            ...editRef.current[memberId],
                                            role_id: selectedRoleId
                                        }
                                    }
                                    setMembers(members => {
                                        if(members === 'loading' || members === 'error'){
                                            throw 'cannot set members during loading or error'
                                        }
                                        return members.map((member)=>({
                                            ...member,
                                            role: member.id === memberId? {
                                                id: selectedRoleId,
                                                label: eventConfig.roles.find((role) => role.id === selectedRoleId)
                                                    ?.label ?? 'MISSING_LABEL'
                                            }: member.role,
                                        }))
                                    })
                                }}
                                width="w-32"
                                maxHeight="max-h-40"
                            />
                        )
                    }
                }
            }
        })
    })
}