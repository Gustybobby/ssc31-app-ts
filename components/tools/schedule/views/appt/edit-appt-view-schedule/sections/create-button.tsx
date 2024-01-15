import { sectionStyles } from "@/components/styles/sections";
import { sendDataToAPI } from "@/components/tools/api";
import type { EditableAppointment } from "@/server/typeconfig/record";
import { usePathname, useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

export default function CreateButton({ apptConfig, refetch, eventId, role }: {
    apptConfig: EditableAppointment
    eventId: string
    role: 'gustybobby' | 'user'
    refetch: Dispatch<SetStateAction<{}>>
}){

    const router = useRouter()
    const pathname = usePathname()

    return(
        <div className="flex justify-end mb-2">
            <button
                className={sectionStyles.button({ color: 'green', border: true, hover: true })}
                onClick={async(e) => {
                    const button = e.target as HTMLButtonElement
                    button.disabled = true
                    const createToast = toast.loading('Creating...')
                    const res = await sendDataToAPI({
                        apiUrl: `/api/${role}/events/${eventId}/appointments`,
                        method: 'POST',
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
                            toast.success('Created', { id: createToast })
                            refetch({})
                            router.replace(pathname)
                            break
                        default:
                            toast.error('Error', { id: createToast })
                            button.disabled = false
                    }
                }}
            >
                Create
            </button>
        </div>
    )
}