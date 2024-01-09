import prisma from "@/prisma-client"
import { redirect } from "next/navigation"

export default async function FormRedirectPage({ params }: { params: { form_id: string }}){
    const { event_id } = await prisma.eventForm.findUniqueOrThrow({
        where: {
            id: params.form_id
        },
        select: {
            event_id: true
        }
    })
    redirect(`/events/${event_id}/forms/${params.form_id}`)
}