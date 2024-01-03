"use client"

import { sectionStyles } from "@/components/styles/sections"
import { sendDataToAPI } from "@/components/tools/api"
import { InputField } from "@/components/tools/input"
import { EventDefaultResponse } from "@/server/typeconfig/event"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

export default function DeleteSection({ eventId }: { eventId: string }){

    const [deleteCode, setDeleteCode] = useState('')
    const canDelete = deleteCode === eventId
    const router = useRouter()

    return(
        <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
            <div className={sectionStyles.title({ color: 'red', extensions: 'mb-2' })}>
                Delete Event
            </div>
            <div className='flex flex-col items-center'>
                <div className="w-full bg-gray-200 dark:bg-black/80 p-3 rounded-lg space-y-2">
                    <div className='text-red-400 font-bold'>
                        <span className="text-red-500">Warning: </span> 
                        Deleting this event will also delete every records related to this event<br/>
                        and this event will be archived along with the members record.
                    </div>
                    <div>
                        Fill in <span className="px-1 font-bold text-yellow-500 dark:text-yellow-400">{eventId}</span> to delete this event.
                    </div>
                    <InputField
                        id="delete_event"
                        label="Delete Event"
                        type="text"
                        placeholder="Fill in the id above"
                        defaultValue={deleteCode}
                        pattern={new RegExp(`^${eventId}$`)}
                        success="Code matched"
                        error="Code mismatched"
                        required={true}
                        autoComplete="off"
                        onChange={(e)=>setDeleteCode(e.target.value)}
                        size="lg"
                    />
                    <button 
                        className={sectionStyles.button({ color: canDelete? 'red' : 'gray', hover: canDelete, border: true })}
                        disabled={!canDelete}
                        onClick={async(e) => {
                            const button = e.target as HTMLButtonElement
                            button.disabled = true
                            if(deleteCode !== eventId){
                                return
                            }
                            const deleteToast = toast.loading('Deleting...')
                            const res: EventDefaultResponse = await sendDataToAPI({
                                apiUrl: `/api/gustybobby/events/${eventId}`,
                                method: 'DELETE',
                                router: router,
                                path: '/gustybobby',
                            })
                            switch(res.message){
                                case 'SUCCESS':
                                    toast.success('Deleted', { id:deleteToast })
                                    break
                                case 'ERROR':
                                    toast.error('Error', { id:deleteToast })
                                    button.disabled = false
                            }
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}