import { sectionStyles } from "@/components/styles/sections";
import { sendDataToAPI } from "@/components/tools/api";
import type { EditableAppointment } from "@/server/typeconfig/record";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

export default function SaveButton({ apptConfig, eventId, role, refetch }: {
    apptConfig: EditableAppointment
    eventId: string
    role: 'gustybobby' | 'user'
    refetch: Dispatch<SetStateAction<{}>>
}){

    const router = useRouter()

    return(
        <div className="flex justify-end mb-2">
            <button
                className={sectionStyles.button({ color: 'blue', border: true, hover: true })}
                onClick={async(e) => {
                    const button = e.target as HTMLButtonElement
                    button.disabled = true
                    const saveToast = toast.loading('Saving...')
                    const res = await sendDataToAPI({
                        apiUrl: `/api/${role}/events/${eventId}/appointments/${apptConfig.id}`,
                        method: 'PUT',
                        body: JSON.stringify({ data: {
                            ...apptConfig,
                            _count: undefined,
                            party_members: undefined,
                            permission: undefined,
                            attendances: undefined,
                        } })
                    })
                    switch (res?.message){
                        case 'SUCCESS':
                            toast.success('Saved', { id: saveToast })
                            refetch({})
                            router.back()
                            break
                        default:
                            toast.error('Error', { id: saveToast })
                            button.disabled = false
                    }
                }}
            >
                Save
            </button>
        </div>
    )
}
