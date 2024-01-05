"use client"

import type { DispatchFormConfig } from "@/components/gustybobby/events/event/forms/form/editor/handlers/state-manager";
import { Card } from "../../card";
import { LiaPlusSolid } from "react-icons/lia";

export default function NewFieldCard({ dispatchFormConfig }: DispatchFormConfig){
    return(
        <div onClick={()=>dispatchFormConfig({ type: 'new_field' })}>
            <Card
                variant="green"
                extraClass="p-6 hover:bg-green-500 cursor-pointer flex justify-center text-2xl font-bold"
            >
                <LiaPlusSolid/>
            </Card>
        </div>
    )
}