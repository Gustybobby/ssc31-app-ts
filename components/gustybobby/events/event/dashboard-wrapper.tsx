"use client"

import TabBar from "@/components/tools/tab-bar"
import { Toaster } from "react-hot-toast"

const tabList = [
    { id: 'details', label: 'Details' },
    { id: 'members', label: 'Members' },
    { id: 'forms', label: 'Forms' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'hours', label: 'Hours' },
    { id: 'files', label: 'Files' },
    { id: 'settings', label: 'Settings' },
]

interface DashboardWrapperProps {
    children: React.ReactNode
    eventId: string
    eventTitle: string
}

export default function DashboardWrapper({ children, eventId, eventTitle }: DashboardWrapperProps){
    return(
        <>
            <div><Toaster/></div>
            <div className="w-full h-full bg-transparent dark:bg-black/70 overflow-auto">
                <div className="bg-gray-200 dark:bg-gray-800">
                    <div className="flex items-center space-x-1 p-2 text-2xl font-bold">
                        <span>{eventTitle}</span>
                    </div>
                    <TabBar
                        commonPath={`/gustybobby/events/${eventId}`}
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