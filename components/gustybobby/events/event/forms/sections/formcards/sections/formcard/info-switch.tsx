"use client"

import { sendDataToAPI } from "@/components/tools/api"
import { SliderSwitch } from "@/components/tools/switch"
import type { FormType } from "@prisma/client"
import type { Dispatch, SetStateAction } from "react"

interface InfoSwitchProps {
    eventId: string
    form: {
        id: string
        title: string
        type: FormType
        open: boolean
    }
    responseCount: number
    updatedAt: Date
    setRefetch: Dispatch<SetStateAction<boolean>>
}

export default function InfoSwitch({ eventId, form, responseCount, updatedAt, setRefetch }: InfoSwitchProps){
    return(
        <div>
            <div className="flex justify-between items-start mb-2">
                <div className="text-xl font-bold underline inline">
                    {form.title}
                </div>
                <div className="mr-1">
                    <SliderSwitch
                        on={form.open}
                        onColor="bg-green-600"
                        offColor="bg-red-600"
                        pinColor="bg-white"
                        size="md"
                        onChange={async()=>toggleForm(eventId, form.id, form.open)}
                    />
                </div>
            </div>
            <div className="mb-2 font-semibold text-blue-600 dark:text-blue-400">
                Type: {form.type}
            </div>
            <div className={styles.formStatus(form.open)}>
                Status: {form.open? 'ONLINE' : 'OFFLINE'}
            </div>
            <div className="mb-2 font-semibold text-purple-600 dark:text-purple-400">
                {responseCount} responses
            </div>
            <div className="mb-2 font-semibold text-black dark:text-white">
                Last Updated: {(new Date(updatedAt)).toLocaleString()}
            </div>
        </div>
    )
}

async function toggleForm(eventId: string, id: string, open: boolean){
    await sendDataToAPI({
        apiUrl: `/api/gustybobby/events/${eventId}/forms/${id}`,
        method: 'PATCH',
        body: JSON.stringify({ open: !open }),
    })
}

const styles = {
    formStatus: (on: boolean) => [
        'mb-1 font-semibold',
        on? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
    ].join(' '),
}