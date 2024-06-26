"use client"

import { Card } from "@/components/tools/card"
import LinkButtons from "./links"
import InfoSwitch from "./info-switch"
import type { FormType } from "@prisma/client"
import type { Dispatch, SetStateAction } from "react"

interface FormCardProps {
    eventId: string
    form: {
        id: string
        title: string
        type: FormType
        open: boolean
    }
    responseCount: number
    updatedAt: Date
    refetch: Dispatch<SetStateAction<{}>>
}

export default function FormCard({
    eventId,
    form,
    responseCount,
    updatedAt,
    refetch,
}: FormCardProps){
    return(
        <Card variant="white-gray" extraClass="max-w-sm min-h-72 p-4">
            <div className="h-full flex flex-col justify-between">
                <InfoSwitch
                    eventId={eventId}
                    form={form}
                    responseCount={responseCount}
                    updatedAt={updatedAt}
                    refetch={refetch}
                />
                <LinkButtons
                    eventId={eventId}
                    formId={form.id}
                />
            </div>
        </Card>
    )
}