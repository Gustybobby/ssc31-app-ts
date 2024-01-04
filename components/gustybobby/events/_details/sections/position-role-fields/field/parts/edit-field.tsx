"use client"

import { InputField } from "@/components/tools/input"
import type { DispatchEventDetails } from "../../../../hooks/event-details-reducer"

interface EditFieldProps extends DispatchEventDetails {
    name: 'positions' | 'roles'
    id: string
    index: number
    label: string
    defaultValue: string
    customValid: (input: string) => { valid: boolean; message: string; }
}

export default function EditField({ name, id, index, label, defaultValue, customValid, dispatchEventDetails }: EditFieldProps){
    return(
        <div className="col-span-3 mb-2">
            <InputField
                id={id}
                type="text"
                label={label}
                placeholder={label}
                defaultValue={defaultValue}
                pattern={/^[\w\s]{1,32}$/}
                success={`${(name === 'positions')? 'Position' : 'Role'} is valid.`}
                error="A-Z, a-z, 0-9, max 32 chars."
                customValid={customValid}
                onChange={(e) => {
                    dispatchEventDetails({ 
                        type: (name==='positions')? 'edit_position' : 'edit_role',
                        index: index,
                        field_key: 'label',
                        value: e.target.value
                    })
                }}
                required={true}
                autoComplete="off"
                size="lg"
            />
        </div>
    )
}