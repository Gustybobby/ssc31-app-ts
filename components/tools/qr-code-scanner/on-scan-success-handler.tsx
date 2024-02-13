import type { Html5Qrcode } from "html5-qrcode"
import toast from "react-hot-toast"
import { sendDataToAPI } from "../api"

interface OnScanSuccessHandler {
    role: 'gustybobby' | 'user'
    decodedText: string
    html5QrCode: Html5Qrcode
    checkType: 'in' | 'out'
    eventId: string
    apptId: string
}

export default async function onScanSuccessHandler({ role, decodedText, html5QrCode, checkType, eventId, apptId }: OnScanSuccessHandler){
    const checkToast = toast.loading(`Checking ${checkType}...`)
    html5QrCode.pause(true)
    try {
        const { message, data } = await sendDataToAPI({
            apiUrl: `/api/${role}/${role === 'user'? `events/${eventId}/` : ''}validation/qr-code`,
            method: 'POST',
            body: JSON.stringify({ data: decodedText })
        })
        if(message !== 'SUCCESS'){
            throw message
        }
        const member = await fetch(`/api/${role}/events/${eventId}/users/${data.user_id}?id=1`)
        const memberRes = await member.json()
        if(memberRes.message !== 'SUCCESS'){
            throw 'User is invalid or not a member of this event'
        }
        const memberId: string = memberRes.data.id
        const checkRes = await sendDataToAPI({
            apiUrl: `/api/${role}/events/${eventId}/members/${memberId}/appointments/${apptId}/attendances`,
            method: 'PUT',
            body: JSON.stringify({
                data: {
                    [`check_${checkType}`]: new Date()
                }
            })
        })
        switch(checkRes.message){
            case 'SUCCESS':
                toast.success(
                    `Checked ${checkType} '${memberId}' at ${(new Date(checkRes.data[`check_${checkType}`])).toLocaleString()}`,
                    { id: checkToast }
                )
                break
            default:
                throw 'Member might not belong to this appointment'
        }
    } catch(e) {
        toast.error(String(e), { id: checkToast })
    }
    setTimeout(() => {
        html5QrCode.resume()
    }, 1500)
}