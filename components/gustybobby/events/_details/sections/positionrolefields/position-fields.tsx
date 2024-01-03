"use client"

import { memo } from "react"
import Field from "./field/field"
import NewField from "./newfield"
import { ZoomIn } from "@/components/tools/transition"
import { sectionStyles } from "@/components/styles/sections"
import type { DispatchEventDetails } from "../../hooks/event-details-reducer"
import type { PositionDataRequest } from "@/server/typeconfig/event"

interface PositionFieldsProps extends DispatchEventDetails{
    positions: PositionDataRequest[]
}

function PositionFieldsComponent({ positions, dispatchEventDetails }: PositionFieldsProps){
    return(
        <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
            <h1 className={sectionStyles.title({ color: 'yellow', extensions: 'mb-2' })}>
                Positions
            </h1>
            <div className="flex flex-col justify-start bg-gray-200 dark:bg-black/70 p-6 rounded-2xl">
                {positions.map((field,index)=>(
                    <ZoomIn key={field.id} show={true} as="div">
                        <Field
                            name="positions"
                            field={field}
                            index={index}
                            canDelete={positions.length > 1}
                            checkDuplicate={()=>checkDuplicate(field, positions)}
                            dispatchEventDetails={dispatchEventDetails}
                        />
                    </ZoomIn>
                ))}
                <NewField
                    name="positions"
                    dispatchEventDetails={dispatchEventDetails}
                />
            </div>
        </div>
    )
}
const PositionFields = memo(PositionFieldsComponent)
export default PositionFields

function checkDuplicate(field: PositionDataRequest, positions: PositionDataRequest[]){
    try{
        const positionLabels = positions.map((position) => position.label)
        if(positionLabels.filter((label) => label == field.label).length > 1){
            return { valid: false, message: `Duplicated positions.`}
        }
        return { valid: true, message: `Position is valid.`}
    } catch(e){
        return { valid: true, message: 'Error' }
    }
}