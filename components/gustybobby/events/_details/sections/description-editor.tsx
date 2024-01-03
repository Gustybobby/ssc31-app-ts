"use client"

import { sectionStyles } from "@/components/styles/sections"
import { ParagraphToolInstruction, descriptionTextAreaStyle, formatText } from "@/components/tools/paragraph"
import type { DispatchEventDetails } from "../hooks/event-details-reducer"

interface DescriptionEditorProps extends DispatchEventDetails {
    description: string
}

export default function DescriptionEditor({ description, dispatchEventDetails }: DescriptionEditorProps){
    return(
        <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
            <h1 className={sectionStyles.title({ color: 'blue', extensions: 'mb-2' })}>
                Descriptions
            </h1>
            <textarea
                className={descriptionTextAreaStyle}
                placeholder="Event Descriptions" 
                value={description}
                onChange={(e) => {
                    if(!e.target.value){
                        e.target.value = ''
                    }
                    dispatchEventDetails({
                        type: 'edit_single',
                        key: 'description',
                        value: formatText(e.target.value, description)
                    })
                }}
            />
            <div className="p-3 space-y-1 my-2 bg-gray-200 dark:bg-black/50 rounded-lg">
                <ParagraphToolInstruction/>
            </div>
        </div>
    )
}