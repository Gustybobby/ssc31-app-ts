"use client"

import { InputField } from "@/components/tools/input"
import type { Dispatch, SetStateAction } from "react"

export default function TitleCodeInput({ formId, formTitle, setCode }: {
    formId: string, formTitle: string, setCode: Dispatch<SetStateAction<string>>
}){
    return(
        <>
            <span className="text-xl font-bold underline">{formTitle}</span>
            <InputField
                id={`DELETE_${formId}`}
                type="text"
                label={`Fill ${formId} to delete`}
                pattern={new RegExp(`^${formId}$`)}
                success="Code matched"
                error="Code mismatched"
                size="sm"
                required={true}
                autoComplete="off"
                onChange={(e) => setCode(e.target.value)}
            />
        </>
    )
}