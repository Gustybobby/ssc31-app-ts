"use client"

import { sectionStyles } from "@/components/styles/sections"
import QrCodeScanner from "@/components/tools/qr-code-scanner/qr-code-scanner"
import toast from "react-hot-toast"
import AppointmentWrapper from "./appointment-wrapper"
import { sendDataToAPI } from "@/components/tools/api"

export default function Appointment({ appt, eventId, qrCodeTab }: {
    appt: { id: string, title: string }
    eventId: string
    qrCodeTab: string
}){
    const isCheckOut = qrCodeTab === 'qr-check-out'
    return (
        <AppointmentWrapper eventId={eventId} apptId={appt.id} apptTitle={appt.title}>
            <div className={sectionStyles.container()}>
                <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                    <h1 className={sectionStyles.title({ color: 'purple', extensions: 'mb-2' })}>
                        {isCheckOut? 'QR Check-out' : 'QR Check-in'}
                    </h1>
                    <div className="flex flex-col items-center">
                        <QrCodeScanner
                            qrcodeId="reader"
                            onSuccess={async(decodedText, html5QrCode) => {
                                const checkToast = toast.loading(isCheckOut? 'Checking out...' : 'Checking in...')
                                html5QrCode.pause(true)
                                try {
                                    const { message, data } = await sendDataToAPI({
                                        apiUrl: '/api/gustybobby/validation/qr-code',
                                        method: 'POST',
                                        body: JSON.stringify({ data: decodedText })
                                    })
                                    if(message !== 'SUCCESS'){
                                        throw message
                                    }
                                    const memberRes = await (await fetch(`/api/gustybobby/events/${eventId}/users/${data.user_id}?id=1`)).json()
                                    if(memberRes.message !== 'SUCCESS'){
                                        throw 'Invalid User'
                                    }
                                    const memberId: string = memberRes.data.id
                                    const checkRes = await sendDataToAPI({
                                        apiUrl: `/api/gustybobby/events/${eventId}/members/${memberId}/appointments/${appt.id}/attendances`,
                                        method: 'PUT',
                                        body: JSON.stringify({ data: isCheckOut? 
                                            { check_out: new Date() } : { check_in: new Date() }
                                        })
                                    })
                                    switch(checkRes.message){
                                        case 'SUCCESS':
                                            if(isCheckOut){
                                                toast.success(
                                                    `Checked out '${memberId}' at ${(new Date(checkRes.data.check_out)).toLocaleString()}`,
                                                    { id: checkToast }
                                                )
                                            } else {
                                                toast.success(
                                                    `Checked in '${memberId}' at ${(new Date(checkRes.data.check_in)).toLocaleString()}`,
                                                    { id: checkToast }
                                                )
                                            }
                                            break
                                        default:
                                            throw 'Error'
                                    }
                                } catch(e) {
                                    toast.error(String(e), { id: checkToast })
                                }
                                setTimeout(() => {
                                    html5QrCode.resume()
                                }, 1500)
                            }}
                        />
                    </div>
                </div>
            </div>
        </AppointmentWrapper>
    )
}