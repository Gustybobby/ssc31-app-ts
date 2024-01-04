"use client"

import { memo } from "react"
import Field from "./field/field"
import NewField from "./newfield"
import { ZoomIn } from "@/components/tools/transition"
import { sectionStyles } from "@/components/styles/sections"
import type { DispatchEventDetails } from "../../hooks/event-details-reducer"
import type { RoleDataRequest } from "@/server/typeconfig/event"

interface RoleFieldsProps extends DispatchEventDetails{
    roles: RoleDataRequest[]
}

function RoleFieldsComponent({ roles, dispatchEventDetails }: RoleFieldsProps){
    return(
        <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
            <h1 className={sectionStyles.title({ color: 'amber', extensions: 'mb-2' })}>
                Roles
            </h1>
            <div className="flex flex-col justify-start bg-gray-200 dark:bg-black/70 p-6 rounded-2xl">
                {roles.map((field,index)=>(
                    <ZoomIn key={field.id} show={true} as="div">
                        <Field
                            name="roles"
                            field={field}
                            index={index}
                            canDelete={roles.length > 1}
                            checkDuplicate={()=>checkDuplicate(field, roles)}
                            dispatchEventDetails={dispatchEventDetails}
                        />
                    </ZoomIn>
                ))}
                <NewField
                    name="roles"
                    dispatchEventDetails={dispatchEventDetails}
                />
            </div>
        </div>
    )
}
const RoleFields = memo(RoleFieldsComponent)
export default RoleFields

function checkDuplicate(field: RoleDataRequest, roles: RoleDataRequest[]){
    try{
        const positionLabels = roles.map((role) => role.label)
        if(positionLabels.filter((label) => label == field.label).length > 1){
            return { valid: false, message: `Duplicated roles.`}
        }
        return { valid: true, message: `Role is valid.`}
    } catch(e){
        return { valid: true, message: 'Error' }
    }
}