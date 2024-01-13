"use client"

import useFormConfig from "@/components/tools/gustybobby-tables/config-fetchers/hooks/use-form-config";
import { GustybobbyOption } from "@/server/typeconfig/form";
import { useEffect, useState } from "react";
import useColumnFetches from "./use-column-fetches";

export default function useDefaultColumns(eventId: string, formId: string, role: 'gustybobby' | 'user'){
    const { formConfig, refetch: refetchFormConfig } = useFormConfig({ eventId, formId, role })
    const { columnFetches, refetch: refetchColumnFetches } = useColumnFetches(eventId, role)
    const [defaultOptions, setDefaultOptions] = useState<GustybobbyOption[] | 'loading' | 'error'>('loading')
    const [shouldRefetch, refetch] = useState({})
    useEffect(() => {
        refetchFormConfig({})
        refetchColumnFetches({})
    }, [shouldRefetch, refetchFormConfig, refetchColumnFetches])
    useEffect(() => {
        if(formConfig === 'loading' || formConfig === 'error'){
            setDefaultOptions(formConfig)
            return
        }
        if(columnFetches === 'loading' || columnFetches === 'error'){
            setDefaultOptions(columnFetches)
            return
        }
        setDefaultOptions(formConfig.field_order?.map((id, index) => {
            const formFields = formConfig.form_fields ?? {}
            return {
                id,
                index,
                label: formFields[id].label,
                active: !!columnFetches?.[formConfig.id ?? ''][id]
            }
        }) ?? [])
    }, [formConfig, columnFetches])
    return { defaultOptions, setDefaultOptions, refetch }
}