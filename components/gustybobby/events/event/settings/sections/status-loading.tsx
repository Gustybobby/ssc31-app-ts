"use client"

import { sectionStyles } from "@/components/styles/sections"

export default function StatusLoading(){
    return(
        <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
            <h1 className={sectionStyles.title({ color: 'sky', extensions: 'mb-2' })}>
                Event Status
            </h1>
            <div className="h-12 rounded-lg shadow-lg bg-gray-200 dark:bg-black/80 flex items-center p-2">
                <div className="w-1/6 h-6 animate-pulse bg-gray-300 dark:bg-white/10 rounded-lg"/>
            </div>
        </div>
    )
}