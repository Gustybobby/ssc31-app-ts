"use client"

import { sectionStyles } from "@/components/styles/sections"
import EditorFieldCard from "@/components/tools/field-cards/field-card-variants/editor-field-card"
import type { EventConfigProperty } from "@/server/classes/eventconfig"
import { memo, useState } from "react"
import NewFieldCard from "@/components/tools/field-cards/field-card-variants/new-field-card"
import type { EditorFieldConfigProperty } from "../hooks/form-config-reducer"
import type { DispatchFormConfig } from "../editor-types"

interface FormFieldsProps extends DispatchFormConfig {
    formFields: { [key: string]: EditorFieldConfigProperty }
    fieldOrder: string[]
    eventConfig: EventConfigProperty
}

function FormFieldsComponent({ formFields, fieldOrder, eventConfig, dispatchFormConfig }: FormFieldsProps){

    const [invisibles, setInvisibles] = useState<Set<string>>(new Set())

    return(
        <div className={sectionStyles.box.gray({ round: false, shadow: false })}>
            <h1 className={sectionStyles.title({ color: 'purple', extensions: 'mb-2' })}>
                Form
            </h1>
            <div className="space-y-2">
                {fieldOrder.map((id, index) => (
                    <div key={id} id={`EDITOR_FIELD_${id}`} className="scroll-mt-32 md:scroll-mt-16">
                        <EditorFieldCard
                            index={index}
                            edge={getEdge(index, fieldOrder.length)}
                            fieldConfig={formFields[id]}
                            eventConfig={eventConfig}
                            visible={!invisibles.has(id)}
                            setInvisibles={setInvisibles}
                            dispatchFormConfig={dispatchFormConfig}
                        />
                    </div>
                ))}
                <NewFieldCard dispatchFormConfig={dispatchFormConfig}/>
            </div>
        </div>
    )
}

const FormFields = memo(FormFieldsComponent)
export default FormFields

function getEdge(index: number, length: number){
    if(length === 1){
        return 'only'
    }
    if(index === 0){
        return 'first'
    }
    if(index === length-1){
        return 'last'
    }
    return 'none'
}