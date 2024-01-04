import prisma from "@/prisma-client"
import { Card } from "@/components/tools/card"
import Link from "next/link"
import MainWrapper from "@/components/globalui/main-wrapper"
import { sectionStyles } from "@/components/styles/sections"
import { redirect } from "next/navigation"

export default async function FormTemplatesPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined }}){
    const templateList = await prisma.eventFormTemplate.findMany({
        select:{
            id: true,
            label: true,
        }
    })
    if(!searchParams?.event_id){
        redirect('/gustybobby')
    }
    return(
        <MainWrapper>
            <div className="w-full h-full dark:bg-black/70 flex flex-col items-center pb-4 overflow-y-auto">
                <h1 className="w-fit m-4 p-2 rounded-lg text-3xl font-bold bg-purple-400 dark:bg-purple-600">
                    Form Templates
                </h1>
                <div className="w-5/6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {templateList.map((template)=>(
                    <Card key={template.id} variant="white-gray" extraClass="p-3 flex flex-col justify-between">
                        <div className="pb-4">
                            {template.label.map((field_label,index) => (
                            <div key={index} className="font-semibold pb-1">
                                {field_label}
                            </div>
                            ))}
                        </div>
                        <div className="flex justify-end">
                            <Link className={sectionStyles.button({ color: 'blue', hover: true, border: true })}
                            prefetch={false}
                            href={{
                                pathname: `/gustybobby/events/${searchParams.event_id}/forms/new`,
                                query: { template: template.id }
                            }}>
                                Use
                            </Link>
                        </div>
                    </Card>
                    ))}
                    <Card variant="white-gray" extraClass="p-3 flex flex-col justify-between">
                        <div className="h-full flex justify-center items-center text-2xl font-bold">
                            Blank Form
                        </div>
                        <div className="w-full flex items-end justify-end">
                            <Link className={sectionStyles.button({ color: 'blue', hover: true, border: true })}
                            prefetch={false}
                            href={`/gustybobby/events/${searchParams.event_id}/forms/new`}>
                                Use
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </MainWrapper>
    )
}