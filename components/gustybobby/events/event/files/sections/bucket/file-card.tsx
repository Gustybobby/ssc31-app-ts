import { sectionStyles } from "@/components/styles/sections";
import { sendDataToAPI } from "@/components/tools/api";
import { FileDisplay } from "@/components/tools/file";
import type { EventDefaultResponse } from "@/server/typeconfig/event";
import { Menu, Transition } from "@headlessui/react";
import { EventFile } from "@prisma/client";
import Link from "next/link";
import { type Dispatch, Fragment, type SetStateAction } from "react";
import toast from "react-hot-toast";

interface FileCardProps {
    eventId: string
    id: string
    label: string
    url: string
    setFiles: SetFiles
}

type SetFiles = Dispatch<SetStateAction<EventFile[] | 'loading' | 'error'>>

export default function FileCard({ eventId, id, label, url, setFiles }: FileCardProps){
    return(
        <div className="min-w-[16rem] w-fit flex flex-col justify-between p-2 rounded-lg shadow-lg bg-gray-200 dark:bg-gray-800">
            <div className="flex justify-between mb-2">
                <span className="text-xl font-bold">{label}</span>
                <EditMenu eventId={eventId} fileId={id} setFiles={setFiles}/>
            </div>
            <div className="flex flex-col items-center justify-center mb-2">
                <FileDisplay
                    id={id}
                    url={url}
                    previewDim={{ width: 384, height: 384 }}
                />
            </div>
            <div className="flex space-x-1 items-center justify-end">
                <Link
                    className={sectionStyles.button({ color: 'yellow', border: false, hover: true, padding:'p-1'})}
                    href={url}
                    target="_blank"
                >
                    View
                </Link>
                <button
                    className={sectionStyles.button({ color: 'blue', border: false, hover: true, padding:'p-1'})}
                    onClick={() => {
                        toast.success('Copied')
                        navigator.clipboard.writeText(url)
                    }}
                >
                    Copy
                </button>
            </div>
        </div>
    )
}

function EditMenu({ eventId, fileId, setFiles }: { eventId: string, fileId: string, setFiles: SetFiles }){
    return(
        <Menu as="div" className="relative inline-block text-left">
            <div>
            <Menu.Button className={sectionStyles.button({ color: 'gray', border: false, hover: true, padding: 'px-2' })}>
                <div className="-translate-y-1">. . .</div>
            </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 mt-1 w-24 rounded-md shadow-lg bg-gray-200 dark:bg-gray-700">
                    <div className="px-1 py-1">
                        <Menu.Item>
                            <button 
                                className={styles.menuButton}
                                onClick={async(e) => {
                                    const button = e.target as HTMLButtonElement
                                    button.disabled = true
                                    const deleteToast = toast.loading('Deleting...')
                                    const res: EventDefaultResponse = await sendDataToAPI({
                                        apiUrl: `/api/gustybobby/events/${eventId}/files/${fileId}`,
                                        method: 'DELETE',
                                    })
                                    switch(res.message){
                                        case 'SUCCESS':
                                            toast.success('Deleted', { id: deleteToast })
                                            setFiles(files => {
                                                if(files === 'error' || files === 'loading'){
                                                    return files
                                                }
                                                return files.filter((file) => file.id !== fileId)
                                            })
                                            break
                                        case 'ERROR':
                                            toast.error('Error', { id: deleteToast })
                                    }
                                    button.disabled = false
                                }}
                            >
                                <span className="text-red-600 dark:text-red-400">Delete File</span>
                            </button>
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

const styles = {
    menuButton: [
        'w-full p-1 rounded-md',
        'text-left',
        'transition-colors',
        'hover:bg-gray-100 dark:hover:bg-gray-600',
    ].join(' ')
}