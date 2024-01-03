"use client"

import { SliderSwitch } from "@/components/tools/switch"
import type { DispatchEventDetails } from "../../../../hooks/event-details-reducer"

interface OpenSwitchProps extends DispatchEventDetails {
    open: boolean
    index: number
}

export default function OpenSwitch({ open, index, dispatchEventDetails }: OpenSwitchProps){
    return(
        <SliderSwitch
            on={open}
            onColor="bg-green-600"
            offColor="bg-red-600"
            pinColor="bg-white"
            size="sm"
            onChange={()=>{
                dispatchEventDetails({ 
                    type: 'edit_position',
                    index: index,
                    field_key: 'open',
                    value: !open
                })
            }}
        />
    )
}