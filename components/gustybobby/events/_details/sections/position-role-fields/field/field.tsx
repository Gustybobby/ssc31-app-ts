"use client"

import type { PositionDataRequest, RoleDataRequest } from "@/server/typeconfig/event"
import type { DispatchEventDetails } from "../../../hooks/event-details-reducer"
import DeleteField from "./parts/delete-field"
import EditField from "./parts/edit-field"
import OpenSwitch from "./parts/open-switch"
import RegistSwitch from "./parts/regist-switch"
import AppointSwitch from "./parts/appoint-switch"

type FieldProps = PositionFieldProps | RoleFieldProps

interface CommonFieldProps extends DispatchEventDetails {
    index: number
    canDelete: boolean
    checkDuplicate: (input: string) => { valid: boolean, message: string }
}

interface PositionFieldProps extends CommonFieldProps {
    name: 'positions'
    field: PositionDataRequest
}

interface RoleFieldProps extends CommonFieldProps {
    name: 'roles'
    field: RoleDataRequest
}

export default function Field({ name, field, index, canDelete, checkDuplicate, dispatchEventDetails }: FieldProps){
    return(
        <div className="grid grid-cols-4">
            {name === 'positions' && 
            <div className="col-span-4 flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                    <span className="text-lg font-bold">Open</span>
                    <OpenSwitch
                        open={field.open}
                        index={index}
                        dispatchEventDetails={dispatchEventDetails}
                    />
                </div>
                <div className="flex items-center space-x-1">
                    <span className="text-lg font-bold">Registrar</span>
                    <RegistSwitch
                        canRegist={field.can_regist}
                        index={index}
                        dispatchEventDetails={dispatchEventDetails}
                    />
                </div>
            </div>
            }
            {name === 'roles' &&
            <div className="col-span-4 flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                    <span className="text-lg font-bold">Appoint</span>
                    <AppointSwitch
                        canAppoint={field.can_appoint}
                        index={index}
                        dispatchEventDetails={dispatchEventDetails}
                    />
                </div>
            </div>
            }
            <EditField
                name={name}
                id={field.id}
                index={index}
                label={field.label.length > 0? field.label : ((name==='positions')? 'Untitled Position' : 'Untitled Role')}
                defaultValue={field.label}
                customValid={checkDuplicate}
                dispatchEventDetails={dispatchEventDetails}
            />
            <DeleteField
                name={name}
                id={field.id}
                canDelete={canDelete}
                dispatchEventDetails={dispatchEventDetails}
            />
        </div>
    )
}