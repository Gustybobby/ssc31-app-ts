'use client'

import { sectionStyles } from "@/components/styles/sections";
import PopUpDialog from "@/components/tools/pop-up-dialog";
import Link from "next/link";
import { useState } from "react";
import { FaLink } from "react-icons/fa";
import useFormShort from "../../../hooks/use-form-short";
import { sendDataToAPI } from "@/components/tools/api";
import toast from "react-hot-toast";

export default function ViewFormPopUp({ eventId, formId }: { eventId: string, formId: string }){

    const [open, setOpen] = useState(false)
    const { formShort, refetch } = useFormShort({ eventId, formId })

    return(
        <div className="flex justify-end order-5">
            <button
                className={sectionStyles.button({ color: 'blue', hover: true, border: true })}
                onClick={() => setOpen(true)}
            >
                View
            </button>
            {open &&
            <PopUpDialog
                open={open}
                setOpen={setOpen}
                panelClassName="bg-gray-200 dark:bg-gray-800 w-80 md:w-1/2 rounded-lg shadow-lg"
            >
                <div className="p-4 flex flex-col items-start space-y-2">
                    <Link
                        target="_blank"
                        href={`/events/${eventId}/forms/${formId}`}
                        className={sectionStyles.button({ color: 'blue', hover: true, border: true })}
                    >
                        Preview Form
                    </Link>
                    <UrlBox
                        title="Full Url"
                        url={window.location.origin+`/events/${eventId}/forms/${formId}?openExternalBrowser=1`}
                    />
                    <UrlBox
                        title="Medium Url"
                        url={window.location.origin+`/forms/${formId}?openExternalBrowser=1`}
                    />
                    <div className="w-full flex flex-col items-start">
                        <h2 className="font-bold text-lg flex items-center">
                            Short Url
                            <button
                                className="ml-2"
                                disabled={!formShort || formShort === 'loading'}
                                onClick={() => {
                                    if(formShort && formShort !== 'loading'){
                                        toast.success('Copied')
                                        navigator.clipboard.writeText(window.location.origin+`/f/${formShort.id}?openExternalBrowser=1`)
                                    }
                                }}
                            >
                                <FaLink/>
                            </button>
                        </h2>
                        <div className="w-full overflow-x-auto flex justify-start rounded-lg p-2 bg-white dark:bg-black/20">
                            {!formShort &&
                            <button
                                className={sectionStyles.button({ color: 'green', hover: true, border: true })}
                                onClick={async(e) => {
                                    const button = e.target as HTMLButtonElement
                                    button.disabled = true
                                    const generateToast = toast.loading('Generating...')
                                    const res = await sendDataToAPI({
                                        apiUrl: `/api/gustybobby/short/form/${formId}`,
                                        method: 'POST',
                                    })
                                    if(res?.message === 'SUCCESS'){
                                        toast.success('Generated', { id: generateToast })
                                    } else {
                                        toast.error(res.message, { id: generateToast })
                                    }
                                    refetch({})
                                }}
                            >
                                Generate Short Url
                            </button>
                            }
                            {formShort === 'loading' &&
                            <span>Loading...</span>
                            }
                            {formShort && formShort !== 'loading' &&
                            <span className="whitespace-nowrap">
                                {window.location.origin+`/f/${formShort.id}?openExternalBrowser=1`}
                            </span>
                            }
                        </div>
                    </div>
                </div>
            </PopUpDialog>
            }
        </div>
    )
}

function UrlBox({ title, url }: { title: string, url: string }){
    return (
        <div className="w-full flex flex-col items-start">
            <h2 className="font-bold text-lg flex items-center">
                {title}
                <button
                    className="ml-2"
                    onClick={() => {
                        toast.success('Copied')
                        navigator.clipboard.writeText(url)
                    }}
                >
                    <FaLink/>
                </button>
            </h2>
            <div className="w-full overflow-x-auto flex justify-start rounded-lg p-2 bg-white dark:bg-black/20">
                <span className="whitespace-nowrap">{url}</span>
            </div>
        </div>
    )
}