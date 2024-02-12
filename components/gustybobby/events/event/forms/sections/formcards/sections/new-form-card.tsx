"use client"

import { Card } from "@/components/tools/card"
import Link from "next/link"

export default function NewFormCard({ eventId }: { eventId: string }){
    return(
        <Card variant="green" extraClass="max-w-sm min-h-72 flex items-center">
            <Link className={styles.newButtonCard} href={`/gustybobby/form-templates?event_id=${eventId}`}>
                +
            </Link>
        </Card>
    )
}

const styles = {
    newButtonCard: [
        'flex justify-center items-center',
        'h-full w-full pb-2 rounded-lg',
        'text-5xl transition-colors',
        'hover:bg-green-500',
    ].join(' '),
}