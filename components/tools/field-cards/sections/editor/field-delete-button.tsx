import type { DispatchFormConfig } from "@/components/gustybobby/events/event/forms/form/editor/handlers/state-manager"
import { sectionStyles } from "@/components/styles/sections"
import type { Dispatch, SetStateAction } from "react"
import { RxCross1 } from "react-icons/rx"

interface FieldDeleteButtonProps extends DispatchFormConfig{
    fieldId: string
    setInvisibles: Dispatch<SetStateAction<Set<string>>>
}

export default function FieldDeleteButton({ fieldId, setInvisibles, dispatchFormConfig }: FieldDeleteButtonProps){
    return(
        <button 
            className={sectionStyles.button({ color: 'red', hover: true, border: true })} 
            onClick={()=>{
                setInvisibles(new Set([fieldId]))
                setTimeout(() => {
                    dispatchFormConfig({ type: 'delete_field', field_id: fieldId })
                },250)
            }}
        >
            <div className="my-1"><RxCross1/></div>
        </button>
    )
}