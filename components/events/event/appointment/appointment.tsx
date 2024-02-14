"use client"

import { sectionStyles } from "@/components/styles/sections"
import QrCodeScanner from "@/components/tools/qr-code-scanner/qr-code-scanner"
import AppointmentWrapper from "./appointment-wrapper"
import onScanSuccessHandler from "@/components/tools/qr-code-scanner/on-scan-success-handler"

export default function Appointment({ role, appt, eventId, qrCodeTab }: {
    role: 'gustybobby' | 'user',
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
                            onSuccess={async(decodedText, html5QrCode) => onScanSuccessHandler({
                                role,
                                decodedText,
                                html5QrCode,
                                checkType: isCheckOut? 'out' : 'in',
                                eventId: eventId,
                                apptId: appt.id,
                            })}
                        />
                        <div className="flex flex-col items-start space-y-4 p-2">
                            <span className="text-xl font-bold underline">Registration Procedure</span>
                            <ol>1. Members must show credentials found on their profile page by pressing Credentials.</ol>
                            <ol>2. Registrar staff scan the QR Code (make sure the scanner is on the correct mode).</ol>
                            <ol>3. QR Code generated on the credentials page expires in 5 minutes, ask the members to refresh once expired.</ol>
                        </div>
                    </div>
                </div>
            </div>
        </AppointmentWrapper>
    )
}