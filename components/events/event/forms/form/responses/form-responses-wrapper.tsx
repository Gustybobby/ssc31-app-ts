"use client"

import { ParamsTabBar } from "@/components/tools/tab-bar"
import { Toaster } from "react-hot-toast"

const tabList = [
    { id: 'responses', label: 'Responses' },
]

interface FormResponsesWrapperProps {
    children: React.ReactNode
    eventId: string
    formId: string
    formTitle: string
}

export default function FormResponsesWrapper({ children, eventId, formId, formTitle }: FormResponsesWrapperProps){
    return(
        <>
            <div><Toaster/></div>
            <div className="w-full h-full bg-transparent dark:bg-black/70 overflow-auto">
                <div className="bg-gray-200 dark:bg-gray-800">
                    <div className="flex items-center space-x-1 p-2 text-2xl font-bold">
                        <span>{formTitle}</span>
                    </div>
                    <ParamsTabBar
                        param="tab"
                        tabList={tabList}
                    />
                </div>
                <div>
                    {children}
                </div>
            </div>
        </>
    )
}