"use client"

import UserFieldCard from "@/components/tools/field-cards/field-card-variants/user-field-card"
import type { EventConfigProperty } from "@/server/classes/eventconfig"
import type { FieldConfigProperty } from "@/server/classes/forms/fieldconfig"
import type { Dispatch, SetStateAction } from "react"
import { FaCheckCircle } from "react-icons/fa"

interface EventFormFieldsProps {
    highlight: string
    setHighlight: Dispatch<SetStateAction<string>>
    interact: boolean
    finished: boolean
    currentPageFields: FieldConfigProperty[]
    eventConfig: EventConfigProperty
}

export default function EventFormFields({ finished, currentPageFields, eventConfig, highlight, setHighlight, interact
}: EventFormFieldsProps){
    try{
        return(
            <div>
                {finished?
                <div className="p-4 text-xl flex flex-col items-center font-bold">
                    <FaCheckCircle className="text-4xl mb-2 text-green-600 dark:text-green-400"/>
                    <div>You have finished this form!</div>
                    <div>Press {'"Submit"'} to submit the form.</div>
                </div>
                :
                <div className="space-y-2">
                    {currentPageFields.map((field) => (
                    <div
                        key={field.id}
                        id={`${field.id}_AUTOSCROLL`}
                        className={styles.fieldHighlight(highlight === field.id)}
                        onClick={()=>setHighlight('')}
                    >
                        <UserFieldCard
                            contentConfig={field}
                            eventConfig={eventConfig}
                            defaultInteract={interact}
                        />
                    </div>
                    ))}
                </div>
                }
            </div>
        )
    } catch(e){
        
        return <div className="w-full h-full bg-white">{JSON.stringify(e)}</div>
    }
}

const styles = {
    fieldHighlight: (highlight: boolean) => [
        'rounded-lg transition-colors',
        'border',
        highlight? 'border-red-400 dark:border-red-600' : 'border-transparent'
    ].join(' ')
}