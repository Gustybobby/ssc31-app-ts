import prisma from "@/prisma-client"
import FormConfig from "@/server/classes/forms/formconfig"
import { redirect } from "next/navigation"
import AvailableForms from "@/components/events/event/forms/available-forms"
import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils"
import { getEventMember } from "@/server/modules/get-event-member"

export default async function AllEvaluateFormPage({ params }: { params: { event_id: string }}){
    const session = await getServerAuthSession()
    const evalForms = await prisma.eventForm.findMany({
        where:{
            event_id: params.event_id,
            type: 'EVALUATE',
            open: true,
        },
        select:{
            id: true,
            title: true,
            public: true,
            email_restricts: true,
            position_restricts: true,
            role_restricts: true,
        },
    })
    const eventMember = await getEventMember(prisma, {
        user_id: session?.user.id ?? '',
        event_id: params.event_id,
    })
    const filteredEvalForms = evalForms.filter((form) => {
        const restrictedAccess = FormConfig.fromDatabase(form).userCanAccess({
            email: session?.user.email ?? '',
            position_id: eventMember?.position_id ?? null,
            role_id: eventMember?.role_id ?? null,
        })
        const generalAccess = form.public || eventMember
        return restrictedAccess || generalAccess
    })
    if(filteredEvalForms.length === 1){
        redirect(`/events/${params.event_id}/forms/${filteredEvalForms[0].id}`)
    }
    return (
        <AvailableForms
            event_id={params.event_id}
            title="Available Evaluate Forms"
            forms={filteredEvalForms}
            linkLabel="Evaluate"
        />
    )
}