"use client"

import { sectionStyles } from "@/components/styles/sections"
import Link from "next/link"

export default function LinkButtons({ eventId, formId }: { eventId: string, formId: string}){
    return(
        <div className="mt-6 flex justify-between items-center">
            <Link
                href={`/events/${eventId}/forms/${formId}/responses?tab=responses`}
                className={sectionStyles.button({ color: 'blue', large: true, border: true, hover: true })}
            >
                Responses
            </Link>
            <Link 
                href={`/gustybobby/events/${eventId}/forms/${formId}/editor`}
                className={sectionStyles.button({ color: 'yellow', large: true, border: true, hover: true })}
            >
                Edit
            </Link>
        </div>
    )
}