"use client"

import type { GustybobbyOption } from "@/server/typeconfig/form"
import { InputField } from "@/components/tools/input"
import { useState } from "react"
import { FaInfoCircle } from "react-icons/fa"
import PopUpDialog from "@/components/tools/pop-up-dialog"
import useColumnFetchesEditor, { getColumnFetchesGroupOptions } from "./hooks/use-column-fetches-editor"
import { ListBoxMultiSelect, ListBoxSingleSelect } from "@/components/tools/list-box"
import { contentPatterns } from "@/server/classes/forms/contentconfig"
import { sectionStyles } from "@/components/styles/sections"
import { sendDataToAPI } from "@/components/tools/api"
import toast from "react-hot-toast"
import DefaultColumnsLoading from "./default-columns-loading"

export default function EventDefaultColumns({ eventId, form }: {
    eventId: string
    form: GustybobbyOption | undefined
}){

    const { columnFetchesEditor, dispatchColumnFetchesEditor, refetch } = useColumnFetchesEditor(eventId, form?.id ?? '', 'gustybobby')

    if(columnFetchesEditor === 'loading'){
        return <DefaultColumnsLoading/>
    }
    if(columnFetchesEditor === 'error'){
        throw 'fetch column_fetches error'
    }
    return (
        <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-2 min-h-screen">
            <button
                className={sectionStyles.button({ color: 'blue', border: true, hover: true, extensions: 'mb-2' })}
                onClick={async() => {
                    const saveToast = toast.loading('Saving...')
                    const res = await sendDataToAPI({
                        apiUrl: `/api/gustybobby/events/${eventId}`,
                        method: 'PATCH',
                        body: JSON.stringify({ data: { column_fetches: columnFetchesEditor.groups }})
                    })
                    switch(res.message){
                        case 'SUCCESS':
                            toast.success('Saved', { id: saveToast })
                            refetch({})
                            break
                        default:
                            toast.error('Error', { id: saveToast })
                    }
                }}
            >
                Save
            </button>
            <div className="text-xl mb-2">
                <span className="font-bold">Selected Form:</span> {form?.label}
            </div>
            <div className="flex space-x-2">
                <div>
                    <span className="text-xl font-bold">Select Group</span>
                    <ListBoxSingleSelect
                        list={getColumnFetchesGroupOptions(columnFetchesEditor.groups, columnFetchesEditor.group_id_view)}
                        setList={(list) => {
                            const selectedGroup = list.find((item) => item.active).id
                            dispatchColumnFetchesEditor({ type: 'set_group_view', value: selectedGroup })
                        }}
                        width="w-36"
                        maxHeight="max-h-28"
                    />
                </div>
                <div className="flex items-end">
                    <button
                        className={sectionStyles.button({ color: 'red', border: true, hover: true })}
                        onClick={() => {
                            dispatchColumnFetchesEditor({ type: 'delete_group' })
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-bold">New Group</span>
                <div className="flex items-end space-x-1">
                    <div>
                        <InputField
                            id="new_column_fetches_group"
                            type="text"
                            defaultValue=""
                            pattern={contentPatterns.label}
                            size="sm"
                            required={false}
                            autoComplete="off"
                        />
                    </div>
                    <div className="mb-2">
                        <button
                            className={sectionStyles.button({ color: 'green', hover: true, border: true })}
                            onClick={() => {
                                const groupNameField = document.getElementById('new_column_fetches_group') as HTMLInputElement
                                const validity = document.getElementById('new_column_fetches_group_VALIDITY') as HTMLInputElement
                                if(validity.value === 'true'){
                                    dispatchColumnFetchesEditor({ type: 'add_group', name: groupNameField.value })
                                }
                            }}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
            {columnFetchesEditor.group_id_view !== '' &&
            <div className="flex justify-start space-x-2">
                <div>
                    <SelectColumnsLabel/>
                    <ListBoxSingleSelect
                        list={columnFetchesEditor.fieldArray}
                        setList={(list)=> {
                            dispatchColumnFetchesEditor({ type: 'edit_fields', fields: list })
                        }}
                        width="w-48"
                        maxHeight="max-h-96"
                    />
                </div>
                <div>
                    <span>Table View</span>
                    <ListBoxMultiSelect
                        list={columnFetchesEditor.viewTableArray}
                        placeholder="Table View"
                        setList={(list)=> {
                            dispatchColumnFetchesEditor({ type: 'edit_table_view', fields: list })
                        }}
                        width="w-28"
                        maxHeight="max-h-96"
                    />
                </div>
            </div>
            }
        </div>
    )
}

function SelectColumnsLabel(){

    const [open, setOpen] = useState(false)
    
    return(
        <div className="flex items-center">
            Select column to expose&nbsp;
            <button onClick={() => setOpen(true)}>
                <FaInfoCircle/>
            </button>
            <PopUpDialog
                open={open}
                setOpen={setOpen}
                panelClassName="bg-gray-200 dark:bg-gray-800 p-2 rounded-lg shadow-lg text-xl w-80"
            >
                <span className="font-bold underline mb-2">Exposing columns</span>
                <div className="text-lg mb-2">
                    Exposed columns will become associated with the members
                    and will show up as default anytime a member list is shown somewhere else.
                </div>
                <div className="text-lg">
                    The columns will only appear if the member has sufficient permission
                    to view the columns.
                </div>
            </PopUpDialog>
        </div>
    )
}