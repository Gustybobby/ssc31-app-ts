"use client"

import type { Dispatch, SetStateAction } from "react"
import Warning from "./sections/warning"
import DeleteCard from "./sections/deletecard/delete-card"
import { FormCardConfig } from "../form-cards-types"

export default function DeleteFormsSection({ eventId, eventForms, refetch }: {
    eventId: string, eventForms: FormCardConfig[], refetch: Dispatch<SetStateAction<{}>>
}){
    return(
        <>
            <Warning/>
            <div className="flex flex-col space-y-2">
                {eventForms.map((form) => (
                    <DeleteCard
                        key={form.id}
                        eventId={eventId}
                        formId={form.id}
                        formTitle={form.title}
                        refetch={refetch}
                    />
                ))}
            </div>
        </>
    )
}