import { sectionStyles } from "@/components/styles/sections";
import { sendDataToAPI } from "@/components/tools/api";
import { InputField } from "@/components/tools/input";
import PopUpDialog from "@/components/tools/pop-up-dialog";
import { usePathname, useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { MdWarningAmber } from "react-icons/md";

interface PopUpDeleteProps {
    eventId: string
    apptId: string
    openDelete: boolean
    setOpenDelete: Dispatch<SetStateAction<boolean>>
    role: 'gustybobby' | 'user'
}

export default function PopUpDelete({ eventId, apptId, openDelete, setOpenDelete, role }: PopUpDeleteProps){

    const [disable, setDisable] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    return(
        <PopUpDialog
            open={openDelete}
            setOpen={setOpenDelete}
            panelClassName="w-80 flex flex-col items-center p-2 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg"
        >
            <MdWarningAmber className="text-5xl text-red-600 dark:text-red-400"/>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                Warning
            </div>
            <div className="text-center mb-2">
                <span className="text-red-600 dark:text-red-400">
                    Deleting
                </span>&nbsp;
                the appointment will remove all records related to it and may cause bad consequences.
            </div>
            <div className="mb-2">
                <InputField
                    id="delete_appointment"
                    type="text"
                    label={<>Fill in <span className="text-base font-normal text-yellow-600 dark:text-yellow-400">{apptId}</span> to delete</>}
                    pattern={new RegExp(`^${apptId}$`)}
                    success="Code matched"
                    error="Code mismatched"
                    required={true}
                    autoComplete="off"
                    size="sm"
                    onChange={(e) => setDisable(String(e.target.value).match(`^${apptId}$`)? false : true)}
                />
            </div>
            <button 
                className={sectionStyles.button({ color: disable? 'gray' : 'red', hover: !disable, border: true })}
                disabled={disable}
                onClick={async (e) => {
                    const button = e.target as HTMLButtonElement
                    button.disabled = true
                    const deleteToast = toast.loading('Deleting...')
                    const deleteAppt = await sendDataToAPI({
                        apiUrl: `/api/${role}/events/${eventId}/appointments/${apptId}`,
                        method: 'DELETE',
                    })
                    const res = await deleteAppt.json()
                    switch(res.message){
                        case 'SUCCESS':
                            toast.success('Deleted', { id: deleteToast })
                            router.replace(pathname)
                            break
                        default:
                            toast.error('Error', { id: deleteToast })
                            button.disabled = false
                    }
                }}
            >
                Delete
            </button>
        </PopUpDialog>
    )
}