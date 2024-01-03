"use client"

import { SliderSwitch } from "@/components/tools/switch"
import type { DispatchEventDetails } from "../../../../hooks/event-details-reducer"

interface AppointSwitchProps extends DispatchEventDetails {
    canAppoint: boolean
    index: number
}

export default function AppointSwitch({ canAppoint, index, dispatchEventDetails }: AppointSwitchProps){
    return(
        <SliderSwitch
            on={canAppoint}
            onColor="bg-green-600"
            offColor="bg-red-600"
            pinColor="bg-white"
            size="sm"
            onChange={()=>{
                dispatchEventDetails({ 
                    type: 'edit_role',
                    index: index,
                    field_key: 'can_appoint',
                    value: !canAppoint
                })
            }}
        />
    )
}