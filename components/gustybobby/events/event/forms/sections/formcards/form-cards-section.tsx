"use client"

import type { FormType } from "@prisma/client"
import FormCard from "./sections/formcard/form-card"
import type { Dispatch, SetStateAction } from "react"
import NewFormCard from "./sections/new-form-card"

export interface FormCardConfig {
    id: string
    title: string
    type: FormType
    open: boolean
    _count: {
        row_list: number
    }
    updated_at: Date
}

export default function FormCardsSection({ eventId, eventForms, setRefetch }: { 
    eventId: string, eventForms: FormCardConfig[], setRefetch: Dispatch<SetStateAction<boolean>>
}){
    return(
        <div className="md:grid md:grid-cols-3 md:gap-2 xl:grid-cols-4 mb-2 space-y-2 md:space-y-0">
            {eventForms.map((form) => (
                <FormCard
                    key={form.id}
                    eventId={eventId}
                    form={form}
                    responseCount={form._count.row_list}
                    updatedAt={form.updated_at}
                    setRefetch={setRefetch}
                />
            ))}
            <NewFormCard eventId={eventId}/>
        </div>
    )
}