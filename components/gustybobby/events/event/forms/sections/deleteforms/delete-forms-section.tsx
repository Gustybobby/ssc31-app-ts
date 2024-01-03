"use client"

import type { Dispatch, SetStateAction } from "react"
import { FormCardConfig } from "../formcards/form-cards-section"
import Warning from "./sections/warning"
import DeleteCard from "./sections/deletecard/delete-card"

export default function DeleteFormsSection({ eventId, eventForms, setRefetch }: {
    eventId: string, eventForms: FormCardConfig[], setRefetch: Dispatch<SetStateAction<boolean>>
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
                        setRefetch={setRefetch}
                    />
                ))}
            </div>
        </>
    )
}