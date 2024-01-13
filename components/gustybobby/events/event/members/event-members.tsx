"use client"

import DashboardWrapper from "../dashboard-wrapper"
import { sectionStyles } from "@/components/styles/sections"
import { useRef, useState } from "react"
import type { GustybobbyOption } from "@/server/typeconfig/form"
import { ListBoxSingleSelect } from "@/components/tools/list-box"
import EventDefaultColumns from "./event-default-columns"
import type { UseEditableMembersTableProps } from "@/components/tools/gustybobby-tables/tables/hooks/use-editable-members-table"
import MembersTable from "@/components/tools/gustybobby-tables/tables/members-table"
import useEditableMembersTable from "@/components/tools/gustybobby-tables/tables/hooks/use-editable-members-table"
import GustybobbyTableLoading from "@/components/tools/gustybobby-tables/tables/gustybobby-table-loading"
import { sendDataToAPI } from "@/components/tools/api"
import toast from "react-hot-toast"

export default function EventMembers({ event_id, event_title, forms }: {
    event_id: string,
    event_title: string,
    forms: { id: string, title: string }[]
}){

    const [formOptions, setFormOptions] = useState<GustybobbyOption[]>(forms.map(({ id, title }, index) => ({
        id, label: title, index, active: index === 0
    })))
    const editRef: UseEditableMembersTableProps['editRef'] = useRef({})
    const { table, refetch } = useEditableMembersTable({
        eventId: event_id,
        formId: formOptions.find((option) => option.active)?.id ?? '',
        role: 'gustybobby',
        editRef
    })

    if(table === 'error'){
        throw 'fetch table error'
    }
    return(
        <DashboardWrapper eventId={event_id} eventTitle={event_title}>
            <div className={sectionStyles.container()}>
                <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                    <h1 className={sectionStyles.title({ color: 'amber', extensions: 'mb-2' })}>
                        Members
                    </h1>
                    <div className="mb-2 flex justify-between items-end">
                        <ListBoxSingleSelect
                            list={formOptions}
                            setList={(list) => setFormOptions(list)}
                            width="w-64"
                            maxHeight="max-h-36"
                        />
                        <button
                            className={sectionStyles.button({ color: 'blue', hover: true, border: true })}
                            onClick={async(e) => {
                                const button = e.target as HTMLButtonElement
                                button.disabled = true
                                const saveToast = toast.loading('Saving...')
                                const res = await sendDataToAPI({
                                    apiUrl: `/api/gustybobby/events/${event_id}/members`,
                                    method: 'PATCH',
                                    body: JSON.stringify({ data: editRef.current })
                                })
                                switch(res.message){
                                    case 'SUCCESS':
                                        toast.success('Saved', { id: saveToast })
                                        break
                                    default:
                                        toast.error('Error', { id: saveToast })
                                }
                                button.disabled = false
                                editRef.current = {}
                                refetch({})
                            }}
                        >
                            Save
                        </button>
                    </div>
                    {table === 'loading'?
                    <GustybobbyTableLoading/>
                    :
                    <div className="h-[80vh] overflow-auto border border-black dark:border-white">
                        <MembersTable table={table}/>
                    </div>
                    }
                </div>
            </div>
            <div className={sectionStyles.container()}>
                <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                    <h1 className={sectionStyles.title({ color: 'pink', extensions: 'mb-2' })}>
                        Default Columns
                    </h1>
                    {formOptions.find((option) => option.active) &&
                    <EventDefaultColumns
                        eventId={event_id}
                        form={formOptions.find((option) => option.active)}
                    />
                    }
                </div>
            </div>
        </DashboardWrapper>
    )
}