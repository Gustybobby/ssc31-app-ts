"use client"

import { sectionStyles } from "@/components/styles/sections"
import QrCodeScanner from "@/components/tools/qr-code-scanner/qr-code-scanner"
import toast, { Toaster } from "react-hot-toast"

export default function Appointment(){
    return (
        <>
            <div><Toaster/></div>
            <div className="w-full h-full bg-transparent dark:bg-black/70">
                <div className={sectionStyles.container()}>
                    <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                        <h1 className={sectionStyles.title({ color: 'purple', extensions: 'mb-2' })}>QR Code Scan</h1>
                        <div className="flex flex-col items-center">
                            <QrCodeScanner
                                qrcodeId="reader"
                                onSuccess={async(decodedText, html5QrCode) => {
                                    const checkToast = toast.loading('Checking in...')
                                    html5QrCode.pause(true)
                                    const [userId, isoString] = decodedText.split('</>')
                                    if(!userId || !isoString){
                                        toast.error('Invalid QR Code', { id: checkToast })
                                    }
                                    setTimeout(() => {
                                        toast.success(`Checked in ${userId}`, { id: checkToast })
                                        html5QrCode.resume()
                                    }, 500)
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}