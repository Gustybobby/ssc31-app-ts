"use client"

import { sectionStyles } from "@/components/styles/sections"
import { useState } from "react"
import BucketFiles from "./bucket-files"
import BucketUpload from "./bucket-upload"

export default function Bucket({ eventId }: { eventId: string }){

    const [shouldRefetch, refetch] = useState({})

    return(
        <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
            <h1 className={sectionStyles.title({ color: 'sky', extensions: 'mb-2' })}>Bucket</h1>
            <BucketFiles eventId={eventId} shouldRefetch={shouldRefetch}/>
            <BucketUpload eventId={eventId} refetch={refetch}/>
        </div>
    )
}