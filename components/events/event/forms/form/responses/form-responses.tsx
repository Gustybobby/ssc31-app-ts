"use client"

import { sectionStyles } from "@/components/styles/sections"
import FormResponsesWrapper from "./form-responses-wrapper"
import useDefaultGroupResponses from "@/components/tools/gustybobby-tables/config-fetchers/hooks/use-default-group-responses"
import { useEffect, useState } from "react"
import Table from "@/server/classes/table"
import { memberColumns } from "@/components/tools/gustybobby-tables/config-fetchers/columns"
import type { FormConfigProperty } from "@/server/classes/forms/formconfig"
import type { DefaultResponsesState, GroupsState, MembersTableFormResponse } from "@/components/tools/gustybobby-tables/config-fetchers/config-types"
import { extractTextFromResponseData } from "@/server/inputfunction"
import MembersTable from "@/components/tools/gustybobby-tables/tables/members-table"
import GustybobbyTableLoading from "@/components/tools/gustybobby-tables/tables/gustybobby-table-loading"

export default function FormResponses({ event_id, role, formConfig, responses }: {
    event_id: string
    role: 'user' | 'gustybobby'
    formConfig: FormConfigProperty
    responses: MembersTableFormResponse[]
}){

    const { defaultGroups, defaultResponses } = useDefaultGroupResponses({ eventId: event_id, role, tableView: 'resp' })
    const [table, setTable] = useState<Table | 'loading' | 'error'>(initializeTable({
        formConfig,
        responses,
        groups: defaultGroups,
        defaultResponses,
    }))

    useEffect(() => {
        setTable(initializeTable({
            formConfig,
            responses,
            groups: defaultGroups,
            defaultResponses,
        }))
    }, [formConfig, responses, defaultGroups, defaultResponses])

    if(table === 'error'){
        throw 'table fetching error'
    }
    return (
        <FormResponsesWrapper eventId={event_id} formId={formConfig.id ?? ''} formTitle={formConfig.title ?? ''}>
            <div className={sectionStyles.container()}>
                <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                    <h1 className={sectionStyles.title({ color: 'pink', extensions: 'mb-2' })}>Responses</h1>
                    {table === 'loading'?
                    <GustybobbyTableLoading/>
                    :
                    <MembersTable
                        table={table}
                        headerCellClassName="min-w-36"
                    />
                    }
                </div>
            </div>
        </FormResponsesWrapper>
    )
}

function initializeTable({ formConfig, responses, groups, defaultResponses }: {
    formConfig: FormConfigProperty
    responses: MembersTableFormResponse[]
    groups: GroupsState
    defaultResponses: DefaultResponsesState
}){
    if(defaultResponses === 'error' || groups === 'error'){
        return 'error'
    }
    if(defaultResponses === 'loading' || groups === 'loading'){
        return 'loading'
    }
    return Table.initialize({
        columns: [
            ...memberColumns,
            ...groups,
            Table.formColumnAdapter(formConfig)
        ],
        rows: responses.map((response) => {
            const member = response.member
            return {
                key: response.id,
                value: {
                    ...Table.formResponseAdapter(response, formConfig, { reference_key: 'id' }).value,
                    position: {
                        type: 'pure_single',
                        id: 'position',
                        raw_data: member?.position?.label ?? '',
                        data: member?.position?.label ?? '',
                    },
                    role: {
                        type: 'pure_single',
                        id: 'role',
                        raw_data: member?.role?.label ?? '',
                        data: member?.role?.label ?? ''
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
                    }))
                }
            }
        })
    })
}