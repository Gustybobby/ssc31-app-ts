"use client"

import MainWrapper from "@/components/globalui/main-wrapper"
import { sectionStyles } from "@/components/styles/sections"
import { Card } from "@/components/tools/card"
import Link from "next/link"

type AvailableFormsProps = {
    event_id: string
    title: string
    forms: {
        id: string
        title: string
    }[]
    linkLabel: string
}

export default function AvailableForms({ event_id, title, forms, linkLabel }: AvailableFormsProps){
    return(
        <MainWrapper>
            <div className="w-full h-full dark:bg-black/70 flex flex-col items-center pb-4 overflow-y-auto">
                <h1 className="w-fit m-4 p-2 rounded-lg text-3xl font-bold bg-purple-400 dark:bg-purple-600">
                    {title}
                </h1>
                {forms.length != 0 ?
                <div className="w-5/6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {forms.map((form)=>(
                    <Card key={form.id} variant="white-gray" extraClass="p-3 h-64">
                        <div className="w-full h-full">
                            <div className="h-1/3 text-xl font-bold">{form.title}</div>
                            <div className="h-2/3 flex items-end justify-end">
                                <Link 
                                    className={sectionStyles.button({ color: 'blue', hover: true, border: true })}
                                    prefetch={false}
                                    href={{
                                        pathname: `/events/${event_id}/forms/${form.id}`,
                                    }}
                                >
                                    {linkLabel}
                                </Link>
                            </div>
                        </div>
                    </Card>
                    ))}
                </div>
                :
                <div className="h-full flex flex-col justify-center text-2xl font-bold">
                    No Form Available
                </div>
                }
            </div>
        </MainWrapper>
    )
}