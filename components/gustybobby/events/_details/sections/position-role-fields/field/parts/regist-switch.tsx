"use client"

import { SliderSwitch } from "@/components/tools/switch"
import type { DispatchEventDetails } from "../../../../hooks/event-details-reducer"

interface RegistSwitchProps extends DispatchEventDetails {
    canRegist: boolean
    index: number
}

export default function RegistSwitch({ canRegist, index, dispatchEventDetails }: RegistSwitchProps){
    return(
        <SliderSwitch
            on={canRegist}
            onColor="bg-green-600"
            offColor="bg-red-600"
            pinColor="bg-white"
            size="sm"
            onChange={()=>{
                dispatchEventDetails({ 
                    type: 'edit_position',
                    index: index,
                    field_key: 'can_regist',
                    value: !canRegist
                })
            }}
        />
    )
}