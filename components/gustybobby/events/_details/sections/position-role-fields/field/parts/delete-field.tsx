"use client"

import { sectionStyles } from "@/components/styles/sections"
import { RxCross1 } from "react-icons/rx"
import type { DispatchEventDetails } from "../../../../hooks/event-details-reducer"

interface DeleteFieldProps extends DispatchEventDetails {
    name: 'positions' | 'roles'
    id: string
    canDelete: boolean
}

export default function DeleteField({ name, id, canDelete, dispatchEventDetails }: DeleteFieldProps){
    return(
        <div className="flex items-center col-span-1">
            {canDelete &&
            <button
                className={sectionStyles.button({ color: 'red', extensions: 'm-4', hover: true, border: true })}
                onClick={()=>{
                    dispatchEventDetails({
                        type: 'delete_field',
                        fields_name: name,
                        field_id: id,
                    })
                }}
            >
                <div className="my-1 text-2xl"><RxCross1/></div>
            </button>
            }
        </div>
    )
}