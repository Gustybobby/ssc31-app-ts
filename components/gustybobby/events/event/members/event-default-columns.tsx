"use client"

import type { GustybobbyOption } from "@/server/typeconfig/form"
import useDefaultColumns from "./hooks/use-default-columns"
import { SelectOptions } from "@/components/tools/input"
import { useState } from "react"
import { FaInfoCircle } from "react-icons/fa"
import PopUpDialog from "@/components/tools/pop-up-dialog"

export default function EventDefaultColumns({ eventId, form }: {
    eventId: string
    form: GustybobbyOption | undefined
}){

    const { defaultOptions, setDefaultOptions, refetch } = useDefaultColumns(eventId, form?.id ?? '', 'gustybobby')

    if(defaultOptions === 'loading'){
        return <>Loading</>
    }
    if(defaultOptions === 'error'){
        throw 'fetch column_fetches error'
    }
    return (
        <div>
            <div className="text-xl mb-2">
                <span className="font-bold">Selected Form:</span> {form?.label}
            </div>
           <div className="p-2 bg-black/20 rounded-lg">
                <SelectOptions
                    id="select_column_fetches"
                    options={defaultOptions}
                    label={<SelectColumnsLabel/>}
                    multiple={true}
                    required={false}
                    size="lg"
                    defaultInteract={false}
                />
           </div>
        </div>
    )
}

function SelectColumnsLabel(){

    const [open, setOpen] = useState(false)
    
    return(
        <div className="flex items-center">
            Select columns to expose&nbsp;
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