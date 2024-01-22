"use client"

import TabBar from "@/components/tools/tab-bar"
import { Toaster } from "react-hot-toast"

const tabList = [
    { id: 'profile', label: 'Profile' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'forms', label: 'Forms' },
]

export default function MemberDashboardWrapper({ children, eventId, eventTitle }: {
    children: React.ReactNode,
    eventId: string,
    eventTitle: string,
}){
    return(
        <>
            <div><Toaster/></div>
            <div className="w-full h-full bg-transparent dark:bg-black/70 overflow-auto">
                <div className="bg-gray-200 dark:bg-gray-800">
                    <div className="flex items-center space-x-1 p-2 text-2xl font-bold">
                        <span>{eventTitle}</span>
                    </div>
                    <TabBar
                        commonPath={`/profile/events/${eventId}`}
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