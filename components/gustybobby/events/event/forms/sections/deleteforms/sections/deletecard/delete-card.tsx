"use client"

import { type Dispatch, type SetStateAction, useState } from "react"
import DeleteButton from "./delete-button"
import TitleCodeInput from "./title-code-input"

export default function DeleteCard({ eventId, formId, formTitle, setRefetch }: {
    eventId: string, formId: string, formTitle: string, setRefetch: Dispatch<SetStateAction<boolean>>
}){

    const [code, setCode] = useState('')

    return(
        <div className="p-2 rounded-lg shadow-lg space-y-1 bg-white dark:bg-gray-800">
            <TitleCodeInput formId={formId} formTitle={formTitle} setCode={setCode}/>
            <DeleteButton eventId={eventId} formId={formId} canDelete={code === formId} setRefetch={setRefetch}/>
        </div>
    )
}