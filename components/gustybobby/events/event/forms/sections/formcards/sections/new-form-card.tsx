"use client"

import { Card } from "@/components/tools/card"
import { useRouter } from "next/navigation"

export default function NewFormCard({ eventId }: { eventId: string }){

    const router = useRouter()

    return(
        <Card
            variant="green"
            extraClass="max-w-sm h-64 mb-2 flex justify-center items-center"
        >
            <button className={styles.newButtonCard}
                onClick={()=>{
                    router.push(`/gustybobby/event/${eventId}/forms/editor/template`)
                }}>
                +
            </button>
        </Card>
    )
}

const styles = {
    newButtonCard: [
        'w-full h-full pb-2 rounded-lg',
        'text-5xl transition-colors',
        'hover:bg-green-500',
    ].join(' '),
}