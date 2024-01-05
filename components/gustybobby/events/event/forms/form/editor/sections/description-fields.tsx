import { BasicSyntaxedContentDisplay, descriptionTextAreaStyle, formatText } from "@/components/tools/paragraph"
import { memo } from "react"
import type { DispatchFormConfig } from "../handlers/state-manager"
import { sectionStyles } from "@/components/styles/sections"

interface ParagraphFieldsProps extends DispatchFormConfig {
    field_key: 'description' | 'submitted_area'
    paragraph: string
}

function ParagraphPreview({ paragraph }: { paragraph: string }){
    return(
        <div className={sectionStyles.box.gray({ round: false, shadow: false })}>
            <h1 className={sectionStyles.title({ color: 'blue', extensions: 'mb-2' })}>
                Preview
            </h1>
            <BasicSyntaxedContentDisplay 
                className="flex flex-col justify-start bg-gray-200 dark:bg-black/70 p-6 rounded-2xl space-y-2"
                textString={paragraph}
            />
        </div>
    )
}

function ParagraphEditor({ field_key, paragraph, dispatchFormConfig }: ParagraphFieldsProps){
    return(
        <div className={sectionStyles.box.gray({ round: false, shadow: false })}>
            <h1 className={sectionStyles.title({ color: 'blue', extensions: 'mb-2' })}>
                {field_key === 'description'? 'Description' : 'Submitted Area'}
            </h1>
            <textarea 
                id={`form_${field_key}_textarea`}
                className={descriptionTextAreaStyle}
                placeholder={field_key === 'description'? 'Form Descriptions' : 'Form Submitted Area'}
                onChange={(e) => dispatchFormConfig({
                    type: 'edit_string',
                    key: field_key,
                    value: formatText(e.target.value, paragraph)
                })}
                value={paragraph}
            />
        </div>
    )
}

function ParagraphFieldsComponent({ field_key, paragraph, dispatchFormConfig }: ParagraphFieldsProps){
    return(
        <>
            <ParagraphPreview paragraph={paragraph}/>
            <ParagraphEditor
                field_key={field_key}
                paragraph={paragraph}
                dispatchFormConfig={dispatchFormConfig}
            />
        </>
    )
}
const ParagraphFields = memo(ParagraphFieldsComponent)
export default ParagraphFields
