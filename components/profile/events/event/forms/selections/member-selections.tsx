"use client"

import { sectionStyles } from "@/components/styles/sections"
import { sendDataToAPI } from "@/components/tools/api"
import GustybobbyTableLoading from "@/components/tools/gustybobby-tables/tables/gustybobby-table-loading"
import useUserEditableMembersTable from "@/components/tools/gustybobby-tables/tables/hooks/use-user-editable-members-table"
import MembersTable from "@/components/tools/gustybobby-tables/tables/members-table"
import GustybobbyFilters from "@/components/tools/gustybobby-tables/transformation/gustybobby-filters/gustybobby-filters"
import type Table from "@/server/classes/table"
import { useRef, useState } from "react"
import toast, { Toaster } from "react-hot-toast"

export default function MemberSelections({ event_id, form_id }: { event_id: string, form_id: string }){

    const editRef = useRef({})
    const [transformation, setTransformation] = useState<Table['transformation']>({})
    const { table, formConfig, refetch } = useUserEditableMembersTable({ eventId: event_id, formId: form_id, role: 'user', editRef, transformation })

    if(table === 'error'){
        throw 'table fetching error'
    }
    return (
        <>
            <div><Toaster/></div>
            <div className="w-full h-full bg-transparent dark:bg-black/70 overflow-auto">
                <div className={sectionStyles.container()}>
                    <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                        <h1 className={sectionStyles.title({ color: 'green', extensions: 'mb-2' })}>Members Selection</h1>
                        {table === 'loading'?
                        <GustybobbyTableLoading/>
                        :
                        <>
                            {table.original_rows.length > 0?
                            <>
                                <div className="flex justify-between">
                                    {(typeof formConfig !== 'string') &&
                                    <GustybobbyFilters
                                        columnOptions={[{
                                            id: 'position',
                                            label: 'Position',
                                            index: 0,
                                            active: false,
                                        }].concat(formConfig.field_order?.map((field_id, index) => {
                                            const field = formConfig.form_fields?.[field_id]
                                            return {
                                                id: field_id,
                                                label: field?.label ?? 'MISSING_LABEL',
                                                index: index + 1,
                                                active: false
                                            }
                                        }) ?? [])}
                                        transformationFilters={transformation?.filters ?? {}}
                                        setTransformation={setTransformation}
                                    />
                                    }
                                    <button
                                        className={sectionStyles.button({ color: 'blue', hover: true, border: true, extensions: 'mb-2' })}
                                        onClick={async() => {
                                            const saveToast = toast.loading('Saving selections...')
                                            const res = await sendDataToAPI({
                                                apiUrl: `/api/user/events/${event_id}/forms/${form_id}/selections`,
                                                method: 'PATCH',
                                                body: JSON.stringify({ data: editRef.current })
                                            })
                                            switch(res?.message){
                                                case 'SUCCESS':
                                                    toast.success('Saved', { id: saveToast })
                                                    editRef.current = {}
                                                    break
                                                default:
                                                    toast.error('Error', { id: saveToast })
                                            }
                                            refetch({})
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                                <div className="max-h-[80vh] overflow-y-auto">
                                    <MembersTable
                                        table={table}
                                        headerCellClassName="flex justify-between min-w-28"
                                        transformation={transformation}
                                        setTransformation={setTransformation}
                                        bottomSpacing="h-40"
                                    />
                                </div>
                            </>
                            :
                            <div>No members from this form to be selected</div>
                            }
                        </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}