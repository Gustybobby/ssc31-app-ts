"use client"

import TabBar from "@/components/tools/tab-bar"
import { Toaster } from "react-hot-toast"

const tabList = [
    { id: 'qr-check-in', label: 'QR Check-in' },
    { id: 'qr-check-out', label: 'QR Check-out' },
]

interface AppointmentWrapperProps {
    children: React.ReactNode
    eventId: string
    apptId: string
    apptTitle: string
}

export default function AppointmentWrapper({ children, eventId, apptId, apptTitle }: AppointmentWrapperProps){
    return(
        <>
            <div><Toaster/></div>
            <div className="w-full h-full bg-transparent dark:bg-black/70 overflow-auto">
                <div className="bg-gray-200 dark:bg-gray-800">
                    <div className="flex items-center space-x-1 p-2 text-2xl font-bold">
                        <span>{apptTitle}</span>
                    </div>
                    <TabBar
                        commonPath={`/gustybobby/events/${eventId}/appointments/${apptId}`}
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