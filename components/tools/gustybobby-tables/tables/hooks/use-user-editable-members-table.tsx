"use client"

import Table from "@/server/classes/table";
import { ListBoxSingleSelect } from "@/components/tools/list-box";
import type { EventConfigState, FormConfigState, FormTableConfig, SelectionResponsesState } from "../../config-fetchers/config-types";
import { type MutableRefObject, useState, useEffect, type Dispatch, type SetStateAction } from "react";
import useUserMemberSelections from "../../config-fetchers/hooks/use-user-member-selections";

export interface UseUserEditableMembersTableProps extends FormTableConfig{
    editRef: MutableRefObject<{ [key: string]: { [key: string]: string }}>
    transformation?: Table['transformation']
}

export default function useUserEditableMembersTable({ eventId, formId, role, editRef, transformation }: UseUserEditableMembersTableProps){
    const {
        formConfig,
        responses,
        setResponses,
        eventConfig,
        refetch: refetchMemberSelections
    } = useUserMemberSelections({ eventId, formId, role })
    const [table, setTable] = useState<Table | 'loading' | 'error'>(initializeTable({
        eventConfig,
        formConfig,
        responses,
        setResponses,
        editRef,
        transformation
    }))
    const [shouldRefetch, refetch] = useState({})
    useEffect(() => {
        refetchMemberSelections({})
    }, [shouldRefetch, refetchMemberSelections])
    useEffect(() => {
        setTable(initializeTable({
            eventConfig,
            formConfig,
            responses,
            setResponses,
            editRef,
            transformation,
        }))
    }, [eventConfig, editRef, transformation, formConfig, responses, setResponses])
    return { table, formConfig, refetch }
}

interface InitializeTable {
    eventConfig: EventConfigState
    formConfig: FormConfigState
    responses: SelectionResponsesState
    setResponses: Dispatch<SetStateAction<SelectionResponsesState>>
    editRef: UseUserEditableMembersTableProps['editRef']
    transformation?: Table['transformation']
}

function initializeTable({ eventConfig, formConfig, responses, setResponses, editRef, transformation }: InitializeTable){
    if(eventConfig === 'loading' || formConfig === 'loading' || responses === 'loading'){
        return 'loading'
    }
    if(eventConfig === 'error' || formConfig === 'error' || responses === 'error'){
        return 'error'
    }
    return Table.initialize({
        columns: [
            {
                type: 'pure',
                id: 'position',
                label: 'Position',
                data_type: 'POSITION',
                field_type: 'OPTIONS',
            },
            Table.formColumnAdapter(formConfig)
        ],
        rows: responses.map((response, index) => {
            return {
                key: response.member_id,
                value: {
                    ...Table.formResponseAdapter(response, formConfig, { reference_key: 'member_id' }).value,
                    position: {
                        type: 'pure_single',
                        id: 'position',
                        raw_data: response.member?.position?.label ?? 'None',
                        data: (
                            <ListBoxSingleSelect
                                list={eventConfig.positions.map((position, index) => ({
                                    id: position.id ?? 'MISSING_ID',
                                    label: position.label ?? 'MISSING_LABEL',
                                    index,
                                    active: position.id === response.member?.position?.id
                                })).concat({
                                    id: 'NONE',
                                    label: 'None',
                                    index: eventConfig.positions.length,
                                    active: (response.member?.position?.id ?? 'NONE') === 'NONE'
                                })}
                                setList={(list) => {
                                    const selectedPosition = list.find((option) => option.active)
                                    const memberId = response.member_id
                                    editRef.current = {
                                        ...editRef.current,
                                        [memberId]: {
                                            ...editRef.current[memberId],
                                            position_id: selectedPosition.id
                                        }
                                    }
                                    setResponses(responses => {
                                        if(responses === 'loading' || responses === 'error'){
                                            return responses
                                        }
                                        return responses.map((response) => {
                                            if(response.member_id === memberId){
                                                return {
                                                    ...response,
                                                    member: response.member? {
                                                        ...response.member,
                                                        position: {
                                                            id: selectedPosition.id as string,
                                                            label: selectedPosition.label as string,
                                                        }
                                                    } : null
                                                }
                                            }
                                            return { ...response }
                                        })
                                    })
                                }}
                                width="w-32"
                                maxHeight="max-h-40"
                            />
                        )
                    },
                }
            }
        }),
        transformation,
    })
}