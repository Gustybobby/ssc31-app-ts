import prisma from "@/prisma-client"
import { redirect } from "next/navigation"
import FormConfig from "@/server/classes/forms/formconfig"
import AvailableForms from "@/components/events/event/forms/available-forms"
import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils"
import getEventMember from "@/server/modules/get-event-member"

export default async function AllJoinFormPage({ params }: { params: { event_id: string }}){
    const session = await getServerAuthSession()
    const eventMember = await getEventMember(prisma, {
        user_id: session?.user.id ?? '',
        event_id: params.event_id,
    }, { id: true })
    let filteredJoinForms
    if(!eventMember){
        const joinForms = await prisma.eventForm.findMany({
            where:{
                event_id: params.event_id,
                type: 'JOIN',
                open: true,
            },
            select:{
                id: true,
                title: true,
                public: true,
                email_restricts: true,
            },
        })
        filteredJoinForms = joinForms.filter((form) => 
            (FormConfig.fromDatabase({
                ...form,
                position_restricts: [],
                role_restricts: []
            })).userCanAccess({ 
                email: session?.user.email ?? '',
                position_id: null,
                role_id: null,
            })
        )
        if(filteredJoinForms.length === 1){
            redirect(`/events/${params.event_id}/forms/${filteredJoinForms[0].id}`)
        }
    }
    return (
        <AvailableForms
            event_id={params.event_id}
            title="Available Join Forms"
            forms={filteredJoinForms ?? []}
            linkLabel="Join"
        />
    )
}