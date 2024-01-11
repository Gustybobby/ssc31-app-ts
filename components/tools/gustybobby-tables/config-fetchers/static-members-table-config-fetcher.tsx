"use client"

import GustybobbyTableLoading from "../gustybobby-table-loading";
import StaticMembersTable from "../tables/static-members-table";
import type { FormTableConfig } from "./config-types";
import useFormConfig from "./hooks/use-form-config";
import useMembers from "./hooks/use-members";
import useResponses from "./hooks/use-responses";

export default function StaticMembersTableConfigFetcher({ eventId, formId, role }: FormTableConfig){

    const formConfig = useFormConfig({ eventId, formId, role })
    const responses = useResponses({ eventId, formId, role })
    const members = useMembers({ eventId, formId, role })

    if(formConfig === 'error' || responses === 'error' || members === 'error'){
        throw 'fetching error'
    }
    if(formConfig === 'loading' || responses === 'loading' || members === 'loading'){
        return <GustybobbyTableLoading/>
    }
    return(
        <StaticMembersTable
            formConfig={formConfig}
            responses={responses}
            members={members}
        />
    )
}