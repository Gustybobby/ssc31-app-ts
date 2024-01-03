"use client"

import { sectionStyles } from "@/components/styles/sections"
import type { DispatchEventDetails } from "../hooks/event-details-reducer"

interface TitleInputFieldProps extends DispatchEventDetails {
    eventTitle: string
}

export default function TitleInputField({ eventTitle, dispatchEventDetails }: TitleInputFieldProps){
    return(
        <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
            <input 
                className={styles.titleInput}
                defaultValue={eventTitle} 
                onChange={(e)=>{
                    dispatchEventDetails({ type: 'edit_single', key: 'title', value: e.target.value })
                }}
            />
        </div>
    )
}

const styles = {
    titleInput: [
        'w-full p-1 text-center rounded-md',
        'text-2xl font-semibold',
        'border border-gray-600',
        'bg-gray-200 dark:bg-black/70',
    ].join(' '),
}
