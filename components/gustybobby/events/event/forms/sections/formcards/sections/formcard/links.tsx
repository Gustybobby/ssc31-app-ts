"use client"

import { sectionStyles } from "@/components/styles/sections"
import Link from "next/link"

export default function LinkButtons({ eventId, formId }: { eventId: string, formId: string}){
    return(
        <div className="mt-6 flex justify-between items-center">
            <Link
                href={`/gustybobby/event/${eventId}/forms/responses?form=${formId}&tab=table`}
                className={sectionStyles.button({ color: 'blue', large: true, border: true, hover: true })}
            >
                Responses
            </Link>
            <Link 
                href={`/gustybobby/event/${eventId}/forms/editor?form=${formId}`}
                className={sectionStyles.button({ color: 'yellow', large: true, border: true, hover: true })}
            >
                Edit
            </Link>
        </div>
    )
}