"use client"

import { useEffect, useState } from "react"
import { InputField, styles } from "./input"
import Image from "next/image"
import { sendFileToAPI } from "./api"
import toast from "react-hot-toast"
import { FaRegFile, FaRegFilePdf } from "react-icons/fa"
import { ListBoxSingleSelect } from "./list-box"
import { sectionStyles } from "../styles/sections"
import type { EventDefaultResponse } from "@/server/typeconfig/event"

interface UploadFileConfig {
    id: string
    label: string
    api: { url: string, method: 'POST' | 'PUT' | 'PATCH' }
    preview: boolean
    previewDim?: { width: number, height: number }
    size: 'sm' | 'md' | 'lg'
    onSuccess?: (res: any) => void
    onError?: (res: any) => void
}

export default function UploadFile({ id, label, api, preview, previewDim, size, onSuccess, onError}: UploadFileConfig){
    
    const [file, setFile] = useState<Blob | null>(null)
    const [fileLabel, setFileLabel] = useState('')

    return(
        <div className="flex flex-col space-y-1 p-2 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
                <label className={styles.label('default',size)} htmlFor={id}>{label}</label>
                <button
                    className={sectionStyles.button({ color: file? 'blue' : 'gray', hover: !!file, border: true })}
                    disabled={!file}
                    onClick={async(e) => {
                        const button = e.target as HTMLButtonElement
                        button.disabled = true
                        const uploadToast = toast.loading('Uploading...')
                        const data = new FormData()
                        data.append('file', file ?? '')
                        data.append('label', fileLabel)
                        const res: EventDefaultResponse = await sendFileToAPI({
                            apiUrl: api.url,
                            method: api.method,
                            body: data,
                        })
                        switch(res.message){
                            case 'SUCCESS':
                                if(onSuccess){
                                    onSuccess(res)
                                }
                                setFile(null)
                                setFileLabel('')
                                const fileInput = document.getElementById(id) as HTMLInputElement
                                fileInput.value = ''
                                toast.success('Uploaded', { id: uploadToast })
                                break
                            case 'ERROR':
                                if(onError){
                                    onError(res)
                                }
                                toast.error('Error', { id: uploadToast })
                        }
                        button.disabled = false
                    }}
                >
                    Upload
                </button>
            </div>
            {(preview && file) &&
                <FileDisplay id={id} file={file} previewDim={previewDim}/>
            }
            <input
                id={id}
                type="file"
                onChange={(e) => setFile(e.target?.files?.[0] ?? null)}
            />
            <InputField
                id={id+'_LABEL'}
                type="text"
                label="File Label"
                defaultValue={fileLabel}
                required={true}
                pattern={/^[\u0E00-\u0E7F\w\s]{0,32}$/}
                success="Label is valid"
                error="ก-ฮ,A-Z,a-z,0-9, max 32 chars"
                onChange={(e) => setFileLabel(e.target.value)}
                size="sm"
                autoComplete="off"
            />
        </div>
    )
}

export function FileDisplay({ id, file, url, previewDim }: {
    id: string,
    file?: Blob,
    url?: string,
    previewDim?: { width: number, height: number }
}){
    if(file){
        if(file.type.startsWith('image')){
            return(
                <Image
                    src={URL.createObjectURL(file)}
                    width={previewDim?.width ?? 512}
                    height={previewDim?.height ?? 512}
                    alt={`${id} File`}
                />
            )
        }
        else if(file.type === 'application/pdf'){
            return(
                <FaRegFilePdf className="text-7xl"/>
            )
        }
    }
    else if(url) {
        if(url.endsWith('jpg') || url.endsWith('png')){
            return(
                <Image
                    src={url}
                    width={previewDim?.width ?? 512}
                    height={previewDim?.height ?? 512}
                    alt={`${id} File`}
                />
            )
        }
        else if(url.endsWith('pdf')){
            return(
                <FaRegFilePdf className="text-7xl"/>
            )
        }
    }
    return(
        <FaRegFile className="text-7xl"/>
    )
}

export function ImageURLSelector({ url, fileUrl, setFileUrl }: {
    url: string,
    fileUrl: string,
    setFileUrl: (url: string) => void
}){

    const [files, setFiles] = useState<{ id: string, label: string, url: string }[]>([])

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(data => data.message === 'SUCCESS' ? data.data : [])
            .then(data => setFiles(data))
    },[url])

    return(
        <div className="flex flex-col items-center space-y-2">
            <FileDisplay id={fileUrl} url={fileUrl}/>
            <ListBoxSingleSelect
                list={files.map((option, index) => ({...option, index, active: option.url === fileUrl }))}
                setList={(list) => setFileUrl(list.find((item) => item.active)?.url)}
                width="w-48"
                maxHeight=""
            />
        </div>
    )
}