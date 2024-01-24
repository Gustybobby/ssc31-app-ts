"use client"

import { sectionStyles } from "@/components/styles/sections"
import Bucket from "./sections/bucket/bucket"

export default function EventFiles({ event_id }: { event_id: string }){
    return(
        <div className={sectionStyles.container()}>
            <Bucket eventId={event_id}/>
        </div>
    )
}