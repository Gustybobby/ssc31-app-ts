"use client"

import type { DispatchFormConfig } from "@/components/gustybobby/events/event/forms/form/editor/handlers/state-manager"
import { sectionStyles } from "@/components/styles/sections"
import type { Dispatch, SetStateAction } from "react"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"

interface FieldSwapButtonsProps extends DispatchFormConfig{
    fieldId: string
    index: number
    edge: 'only' | 'first' | 'last' | 'none'
    setInvisibles: Dispatch<SetStateAction<Set<string>>>
}

export default function FieldSwapButtons({ fieldId, index, edge, dispatchFormConfig, setInvisibles }: FieldSwapButtonsProps){

    function swapFields(direction: 1 | -1){
        setInvisibles(new Set([fieldId]))
        setTimeout(() => {
            dispatchFormConfig({ type: 'swap_fields', index, direction })
            setInvisibles(new Set())
            setTimeout(() => {
                document.getElementById(`EDITOR_FIELD_${fieldId}`)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'center'
                })
            },250)
        },200)
    }

    const noUp = edge === 'first' || edge === 'only'
    const noDown = edge === 'last' || edge === 'only'

    return(
        <div className="flex flex-row space-x-2">
            <button
                className={sectionStyles.button({ color: noUp? 'gray' : 'blue', border: true, hover: !noUp })}
                onClick={()=>swapFields(-1)}
                disabled={noUp}
            >
                <div className="my-1"><IoIosArrowUp/></div>
            </button>
            <button
                className={sectionStyles.button({ color: noDown? 'gray' : 'blue', border: true, hover: !noDown })}
                onClick={()=>swapFields(1)}
                disabled={noDown}
            >
                <div className="my-1"><IoIosArrowDown/></div>
            </button>
        </div>
    )
}