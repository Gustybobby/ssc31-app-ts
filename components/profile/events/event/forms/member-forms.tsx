"use client"

import { FormConfigProperty } from "@/server/classes/forms/formconfig"
import { sectionStyles } from "@/components/styles/sections"
import { Card } from "@/components/tools/card"
import Link from "next/link"
import type { DataType, FieldType, FormResponse } from "@/server/typeconfig/form"
import PopUpDialog from "@/components/tools/pop-up-dialog"
import { Fragment, useRef, useState } from "react"
import { extractTextFromResponseData } from "@/server/inputfunction"

interface ResponseRecord {
    id: string
    created_at: Date | null
    snapshot: FormResponse
    form: {
        id: string
        title: string,
        field_order: string[]
        form_fields: {
            [key: string]: {
                id: string,
                label: string,
                data_type: DataType
                field_type: FieldType
            }
        }
    }
}

export default function MemberForms({ forms, responses, event_id, can_regist }: {
    forms: FormConfigProperty[],
    responses: ResponseRecord[],
    event_id: string,
    can_regist: boolean,
}){
    
    const selectedResponse = useRef<ResponseRecord | null>(null)
    const [open, setOpen] = useState(false)

    return (
        <div className={sectionStyles.container()}>
            {forms.length > 0 &&
            <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                <h1 className={sectionStyles.title({ color: 'purple', extensions: 'mb-2' })}>
                    Viewable Forms
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {forms.map((form) => (
                        <Card variant="white-gray" extraClass="p-4" key={form.id}>
                            <div className="flex flex-col space-y-2">
                                <span className="font-bold text-xl">{form.title}</span>
                                <div className="flex justify-between">
                                    <Link
                                        href={`/events/${event_id}/forms/${form.id}/responses?tab=responses`}
                                        className={sectionStyles.button({ color: 'blue', hover: true, border: true, large: true })}
                                    >
                                        Responses
                                    </Link>
                                    {form.type === 'JOIN' && can_regist &&
                                    <Link
                                        href={`/profile/events/${event_id}/forms/${form.id}/selections`}
                                        className={sectionStyles.button({ color: 'pink', hover: true, border: true, large: true })}
                                    >
                                        Select
                                    </Link>
                                    }
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
            }
            <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                <h1 className={sectionStyles.title({ color: 'rose', extensions: 'mb-2' })}>
                    Response Records
                </h1>
                {responses.length > 0 &&
                <div>
                    {responses.map((response) => (
                        <Card variant="white-gray" extraClass="p-4 md:w-fit" key={response.id}>
                            <div className="flex flex-col space-y-2">
                                <span className="font-bold text-xl">{response.form.title}</span>
                                <span className="text-green-600 dark:text-green-400 font-bold">
                                    Submitted at: {response.created_at?.toLocaleString()}
                                </span>
                                <button
                                    onClick={() => {
                                        selectedResponse.current = response
                                        setOpen(true)
                                    }}
                                    className={sectionStyles.button({ color: 'yellow', hover: true, border: true, large: true })}
                                >
                                    Your Responses
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
                }
            </div>
            <PopUpDialog open={open} setOpen={setOpen} panelClassName="mt-16">
                <div className="flex flex-col p-4 space-y-2 bg-gray-200 dark:bg-gray-800 rounded-lg h-[75vh] overflow-y-auto shadow-lg">
                    {selectedResponse.current?.form.field_order.map((field_id) => {
                        const field = selectedResponse.current?.form.form_fields[field_id]
                        const data = extractTextFromResponseData(
                            selectedResponse.current?.snapshot[field_id] ?? '', 
                            field?.field_type ?? 'SHORTANS',
                        )
                        if(data === ''){
                            return <Fragment key={field_id}></Fragment>
                        }
                        return (
                            <div key={field_id} className="flex flex-col items-start">
                                <span className="text-left mb-1 font-bold">
                                    {field?.label}
                                </span>
                                <span className="py-1 px-2 rounded-lg bg-gray-300 dark:bg-gray-700">
                                    {data}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </PopUpDialog>
        </div>
    )
}