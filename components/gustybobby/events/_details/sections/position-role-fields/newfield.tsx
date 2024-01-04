"use client"

import { sectionStyles } from "@/components/styles/sections"
import { LiaPlusSolid } from "react-icons/lia"
import type { DispatchEventDetails } from "../../hooks/event-details-reducer"

interface NewFieldProps extends DispatchEventDetails {
    name: 'positions' | 'roles'
}

export default function NewField({ name, dispatchEventDetails }: NewFieldProps){
    return(
        <div className="flex flex-col items-center">
            <button 
                className={sectionStyles.button({ color: 'green', hover: true, border: true })}
                onClick={()=>{
                    dispatchEventDetails({
                        type: 'new_field',
                        fields_name: name,
                    })
                }}
            >
                <div className="my-1 text-2xl"><LiaPlusSolid/></div>
            </button>
        </div>
    )
}