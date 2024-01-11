"use client"

import DashboardWrapper from "../dashboard-wrapper"
import { sectionStyles } from "@/components/styles/sections"
import { useState } from "react"
import type { GustybobbyOption } from "@/server/typeconfig/form"
import { ListBoxSingleSelect } from "@/components/tools/list-box"
import GustybobbyStaticMembersTable from "@/components/tools/gustybobby-tables/gustybobby-static-members-table"

export default function EventMembers({ event_id, event_title, forms }: {
    event_id: string,
    event_title: string,
    forms: { id: string, title: string }[]
}){

    const [formOptions, setFormOptions] = useState<GustybobbyOption[]>(forms.map(({ id, title }, index) => ({
        id, label: title, index, active: index === 0
    })))

    return(
        <DashboardWrapper eventId={event_id} eventTitle={event_title}>
            <div className={sectionStyles.container()}>
                <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                    <h1 className={sectionStyles.title({ color: 'amber', extensions: 'mb-2' })}>
                        Members
                    </h1>
                    <div className="mb-2">
                        <ListBoxSingleSelect
                            list={formOptions}
                            setList={(list) => setFormOptions(list)}
                            width="w-64"
                            maxHeight="max-h-36"
                        />
                    </div>
                    <GustybobbyStaticMembersTable
                        eventId={event_id}
                        formId={formOptions.find((option) => option.active)?.id ?? ''}
                        role="gustybobby"
                    />
                </div>
            </div>
        </DashboardWrapper>
    )
}