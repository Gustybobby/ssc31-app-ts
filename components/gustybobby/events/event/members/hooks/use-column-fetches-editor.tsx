"use client"

import useFormConfig from "@/components/tools/gustybobby-tables/config-fetchers/hooks/use-form-config";
import { useEffect, useReducer, useState } from "react";
import useColumnFetches from "../../../../../tools/gustybobby-tables/config-fetchers/hooks/use-column-fetches";
import columnFetchesEditorReducer from "./column-fetches-editor-reducer";
import type { ColumnFetches } from "@/server/typeconfig/event";
import { GustybobbyOption } from "@/server/typeconfig/form";

export default function useColumnFetchesEditor(eventId: string, formId: string, role: 'gustybobby' | 'user'){
    const { formConfig, refetch: refetchFormConfig } = useFormConfig({ eventId, formId, role })
    const { columnFetches, refetch: refetchColumnFetches } = useColumnFetches({ eventId, role })
    const [columnFetchesEditor, dispatchColumnFetchesEditor] = useReducer(columnFetchesEditorReducer, 'loading')
    const [shouldRefetch, refetch] = useState({})
    useEffect(() => {
        refetchFormConfig({})
        refetchColumnFetches({})
    }, [shouldRefetch, refetchFormConfig, refetchColumnFetches])
    useEffect(() => {
        if(formConfig === 'loading' || formConfig === 'error'){
            dispatchColumnFetchesEditor({ type: 'set_status', status: formConfig })
            return
        }
        if(columnFetches === 'loading' || columnFetches === 'error'){
            dispatchColumnFetchesEditor({ type: 'set_status', status: columnFetches })
            return
        }
        const firstGroupId = Object.keys(columnFetches ?? {}).find((group_id) => {
            return columnFetches?.[group_id].order === 0
        }) ?? ''
        dispatchColumnFetchesEditor({
            type: 'set',
            group_id: firstGroupId,
            column_fetches: columnFetches,
            form_id: formConfig.id ?? '',
            fieldArray: (formConfig.field_order?.filter((field_id) => formConfig.form_fields?.[field_id].field_type !== 'INFO')
                .map((field_id, index) => ({
                    id: field_id,
                    label: formConfig.form_fields?.[field_id].label ?? 'MISSING_LABEL',
                    index,
                    active: field_id === columnFetches?.[firstGroupId].forms[formConfig.id ?? '']
            })) ?? []).concat({
                id: 'none',
                label: 'None',
                index: formConfig.field_order?.length ?? 0,
                active: !columnFetches?.[firstGroupId].forms[formConfig.id ?? ''],
            })
        })
    }, [formConfig, columnFetches])
    return { columnFetchesEditor, dispatchColumnFetchesEditor, refetch }
}

export function getColumnFetchesGroupOptions(columnFetches: ColumnFetches, group_id_view: string): GustybobbyOption[]{
    const groupOptions = Object.entries(columnFetches ?? {}).map(([group_id, group], index) => ({
        id: group_id,
        label: group.name,
        index,
        active: group_id === group_id_view,
        order: group.order
    }))
    groupOptions.sort((g1, g2) => g1.order - g2.order)
    return groupOptions
}