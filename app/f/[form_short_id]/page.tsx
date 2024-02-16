import prisma from "@/prisma-client"
import { redirect } from "next/navigation"

export default async function ShortFormRedirectPage({ params }: { params: { form_short_id: string }}){
    const formShort = await prisma.eventFormShortId.findUnique({
        where: {
            id: params.form_short_id
        },
        select: {
            form: {
                select: {
                    id: true,
                    event_id: true,
                }
            }
        }
    })
    if(!formShort){
        redirect('/')
    }
    redirect(`/events/${formShort.form.event_id}/forms/${formShort.form.id}`)
}