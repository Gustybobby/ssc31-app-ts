"use client"

import { sectionStyles } from "@/components/styles/sections"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function ContinueButton(){

    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    return(
        <button
            className={sectionStyles.button({ color: 'blue', hover: true, border: true })}
            onClick={() => {
                router.push(pathname+'?page='+String(Number(searchParams.get('page'))+1))
            }}
        >
            Continue
        </button>
    )
}