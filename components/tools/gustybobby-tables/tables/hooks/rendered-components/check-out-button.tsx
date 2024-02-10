"use client"

import { sectionStyles } from "@/components/styles/sections"
import { sendDataToAPI } from "@/components/tools/api"
import type { Dispatch, SetStateAction } from "react"
import toast from "react-hot-toast"
import { attendancesApiUrl } from "../../../config-fetchers/config-urls"

export default function CheckOutButton({
    checkOutExisted,
    eventId,
    role,
    memberId,
    apptId,
    refetch
}: {
    checkOutExisted: boolean
    eventId: string
    memberId: string
    apptId: string
    role: 'user' | 'gustybobby'
    refetch: Dispatch<SetStateAction<{}>>
}){
    return(
        <div className="flex justify-center">
            <button
                className={sectionStyles.button({
                    color: checkOutExisted? 'red' : 'blue',
                    hover: true,
                    border: true
                })}
                onClick={async() => {
                    const checkOutToast = toast.loading(checkOutExisted?  'Canceling...' : 'Checking out...')
                    const res = await sendDataToAPI({
                        apiUrl: attendancesApiUrl({ eventId, role, apptId, memberId }),
                        method: 'PUT',
                        body: JSON.stringify({
                            data: {
                                member_id: memberId,
                                appointment_id: apptId,
                                check_out: checkOutExisted? null : new Date(),
                            }
                        })
                    })
                    switch(res?.message){
                        case 'SUCCESS':
                            toast.success(checkOutExisted? 'Canceled' : 'Checked out', { id: checkOutToast })
                            break
                        default:
                            toast.error('Error', { id: checkOutToast })
                    }
                    refetch({})
                }}
            >
                {checkOutExisted? 'Cancel' : 'C-out'}
            </button>
        </div>
    )
}