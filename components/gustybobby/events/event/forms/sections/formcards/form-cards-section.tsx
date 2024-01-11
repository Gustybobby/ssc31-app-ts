"use client"

import FormCard from "./sections/formcard/form-card"
import type { Dispatch, SetStateAction } from "react"
import NewFormCard from "./sections/new-form-card"
import type { FormCardConfig } from "../form-cards-types"

export default function FormCardsSection({ eventId, eventForms, refetch }: { 
    eventId: string, eventForms: FormCardConfig[], refetch: Dispatch<SetStateAction<{}>>
}){
    return(
        <div className="md:grid md:grid-cols-3 md:gap-2 xl:grid-cols-4 mb-2 space-y-2 md:space-y-0">
            {eventForms.map((form) => (
                <FormCard
                    key={form.id}
                    eventId={eventId}
                    form={form}
                    responseCount={form._count.responses_list}
                    updatedAt={form.updated_at}
                    refetch={refetch}
                />
            ))}
            <NewFormCard eventId={eventId}/>
        </div>
    )
}