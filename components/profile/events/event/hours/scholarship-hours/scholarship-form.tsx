"use client"

import { eventStyles } from "@/components/styles/events"
import UserFieldCard from "@/components/tools/field-cards/field-card-variants/user-field-card"
import { BasicSyntaxedContentDisplay } from "@/components/tools/paragraph"
import { maxHours, scholFieldConfig, scholFormDesc, transferableSems } from "./scholarship"
import { useRef, useState } from "react"
import { TransferRecord } from "@/server/typeconfig/record"
import { sendDataToAPI } from "@/components/tools/api"
import { useRouter } from "next/navigation"
import LoadingSVG from "@/components/svg/loading-svg"

export default function ScholarshipForm({ eventId, eventTitle, activityHours }: {
    eventId: string
    eventTitle: string
    activityHours: number
}){
    const semYears = useRef(transferableSems(new Date()))
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    return (
        <div
            className={eventStyles.box({ size: 'md', round: true, extensions: 'my-4 p-2 space-y-2' })}
        >
            <div className="w-full">
                <h1 className={eventStyles.title({ extensions: 'p-8' })}>
                    {eventTitle} Scholarship Hours Transfer Form
                </h1>
                <BasicSyntaxedContentDisplay
                    className="flex flex-col justify-start p-4 rounded-2xl space-y-2 bg-gray-200 dark:bg-transparent"
                    textString={scholFormDesc(activityHours)}
                />
            </div>
            <div className="w-full space-y-2">
                {semYears.current.map(([sem, year]) => (
                    <UserFieldCard
                        key={`${sem}_${year}`}
                        contentConfig={scholFieldConfig(`${sem}_${year}`, year, sem)}
                        eventConfig={{ id: "", positions: [], roles: [] }}
                        defaultInteract={false}
                    />
                ))}
            </div>
            <div className="text-lg text-red-600 dark:text-red-400">
                {error}
            </div>
            <div className="w-full flex justify-end">
                <button
                    className={eventStyles.button({ color: "green", large: true })}
                    onClick={async(e) => {
                        setError("")
                        const button = e.target as HTMLButtonElement
                        button.disabled = true
                        setLoading(true)
                        const records: TransferRecord[] = []
                        let total = 0
                        for (const [sem,year] of semYears.current){
                            const validity = document.getElementById(`${sem}_${year}_INPUTFIELD_VALIDITY`) as HTMLInputElement | null
                            if (validity?.value !== "true"){
                                setError("Invalid Hours")
                                setLoading(false)
                                button.disabled = false
                                return
                            }
                            const field = document.getElementById(`${sem}_${year}_INPUTFIELD`) as HTMLInputElement | null
                            if (field?.value){
                                records.push({
                                    hrs: +field.value,
                                    semester: sem,
                                    year,
                                })
                                total += +field.value
                            }
                        }
                        if (total > maxHours(activityHours)){
                            setError("Transferred hours exceed maximum hours")
                            setLoading(false)
                            button.disabled = false
                            return
                        }
                        else if (total === 0){
                            setError("You cannot transfer 0 hours")
                            setLoading(false)
                            button.disabled = false
                            return
                        }
                        const res = await sendDataToAPI({
                            apiUrl: `/api/user/events/${eventId}/hours/scholarship`,
                            method: "POST",
                            body: JSON.stringify({ data: records })
                        })
                        if (res.message === "SUCCESS"){
                            router.replace(`/profile/events/${eventId}/hours`)
                        }
                        button.disabled = false
                    }}
                >
                    {loading && <LoadingSVG fillColor="fill-blue-400"/>}Submit
                </button>
            </div>
        </div>
    )
}