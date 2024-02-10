"use client"

import { Html5Qrcode, type QrcodeErrorCallback, type QrcodeSuccessCallback } from "html5-qrcode"
import { useEffect, useRef } from "react";

interface QrCodeScannerProps {
    qrcodeId: string
    onSuccess: (decodedText: string, html5QrCode: Html5Qrcode) => void
}

export default function QrCodeScanner({ qrcodeId, onSuccess }: QrCodeScannerProps){
    const html5QrCode = useRef<Html5Qrcode>()
    
    useEffect(() => {
        if(html5QrCode.current){
            return
        }
        html5QrCode.current = new Html5Qrcode(qrcodeId);
        const qrCodeSuccessCallback: QrcodeSuccessCallback = (decodedText, result) => {
            if(html5QrCode.current){
                onSuccess(decodedText, html5QrCode.current)
            }
        }
        const qrCodeErrorCallback: QrcodeErrorCallback = (errorMessage, error) => {}
        html5QrCode.current.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1,
            },
            qrCodeSuccessCallback,
            qrCodeErrorCallback,
        )
    }, [qrcodeId, onSuccess, html5QrCode]);
    return <div id={qrcodeId} className="w-full md:w-96"></div>;
}