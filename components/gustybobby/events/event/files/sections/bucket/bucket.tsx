"use client"

import { sectionStyles } from "@/components/styles/sections"
import { useState } from "react"
import type { Dispatch, SetStateAction } from "react"
import BucketFiles from "./bucket-files"
import BucketUpload from "./bucket-upload"

export type SetRefetch = Dispatch<SetStateAction<boolean>>

export default function Bucket({ eventId }: { eventId: string }){

    const [refetch, setRefetch] = useState(false)

    return(
        <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
            <h1 className={sectionStyles.title({ color: 'sky', extensions: 'mb-2' })}>Bucket</h1>
            <BucketFiles eventId={eventId} refetch={refetch}/>
            <BucketUpload eventId={eventId} setRefetch={setRefetch}/>
        </div>
    )
}