"use client"

import { ParamsTabBar } from "@/components/tools/tab-bar"
import { Toaster } from "react-hot-toast"

const tabList = [
    { id: 'qr-code-scan-in', label: 'QR Check-in' },
    { id: 'qr-code-scan-out', label: 'QR Check-out' },
]

interface AppointmentWrapperProps {
    children: React.ReactNode
    apptTitle: string
}

export default function AppointmentWrapper({ children, apptTitle }: AppointmentWrapperProps){
    return(
        <>
            <div><Toaster/></div>
            <div className="w-full h-full bg-transparent dark:bg-black/70 overflow-auto">
                <div className="bg-gray-200 dark:bg-gray-800">
                    <div className="flex items-center space-x-1 p-2 text-2xl font-bold">
                        <span>{apptTitle}</span>
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