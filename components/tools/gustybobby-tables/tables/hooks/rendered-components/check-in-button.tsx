"use client"

import { sectionStyles } from "@/components/styles/sections"
import { sendDataToAPI } from "@/components/tools/api"
import toast from "react-hot-toast"
import { attendancesApiUrl } from "../../../config-fetchers/config-urls"
import type { Dispatch, SetStateAction } from "react"

export default function CheckInButton({
    checkInExisted,
    eventId,
    role,
    memberId,
    apptId,
    refetch
}: {
    checkInExisted: boolean
    eventId: string
    memberId: string
    apptId: string
    role: 'user' | 'gustybobby'
    refetch: Dispatch<SetStateAction<{}>>
}){
    return (
        <div className="flex justify-center">
            <button
                className={sectionStyles.button({
                    color: checkInExisted? 'red' : 'green',
                    hover: true,
                    border: true
                })}
                onClick={async() => {
                    const checkInToast = toast.loading(checkInExisted? 'Canceling...' : 'Checking in...')
                    const res = await sendDataToAPI({
                        apiUrl: attendancesApiUrl({ eventId, role, apptId, memberId }),
                        method: 'PUT',
                        body: JSON.stringify({
                            data: {
                                member_id: memberId,
                                appointment_id: apptId,
                                check_in: checkInExisted? null : new Date(),
                            }
                        })
                    })
                    switch(res?.message){
                        case 'SUCCESS':
                            toast.success(checkInExisted? 'Canceled' : 'Checked in', { id: checkInToast })
                            break
                        default:
                            toast.error('Error', { id: checkInToast })
                    }
                    refetch({})
                }}
            >
                {checkInExisted? 'Cancel' : 'C-in'}
            </button>
        </div>
    )
}