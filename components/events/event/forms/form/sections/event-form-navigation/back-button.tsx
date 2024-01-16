"use client"

import { sectionStyles } from "@/components/styles/sections"
import { useRouter } from "next/navigation"

export default function BackButton(){

    const router = useRouter()

    return(
        <button
            className={sectionStyles.button({ color: 'blue', hover: true, border: true })}
            onClick={() => {
                router.back()
            }}
        >
            Back
        </button>
    )
}