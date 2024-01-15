"use client"

import { useEffect, useState } from "react";
import { FormTableConfig, StaticMembersTableInitializeState } from "../../config-fetchers/config-types";
import Table from "@/server/classes/table";
import useFormConfig from "../../config-fetchers/hooks/use-form-config";
import useResponses from "../../config-fetchers/hooks/use-responses";
import useMembers from "../../config-fetchers/hooks/use-members";

export default function useStaticMembersTable({ eventId, formId, role }: FormTableConfig){
    const { formConfig } = useFormConfig({ eventId, formId, role })
    const { responses } = useResponses({ eventId, formId, role })
    const { members } = useMembers({ eventId, role })
    const [table, setTable] = useState<Table | 'loading' | 'error'>(initializeTable({ formConfig, responses, members }))
    useEffect(() => {
        setTable(initializeTable({ formConfig, responses, members }))
    }, [formConfig, responses, members])
    return table
}

function initializeTable({ formConfig, responses, members }: StaticMembersTableInitializeState){
    if(formConfig === 'loading' || responses === 'loading' || members === 'loading'){
        return 'loading'
    }
    if(formConfig === 'error' || responses === 'error' || members === 'error'){
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