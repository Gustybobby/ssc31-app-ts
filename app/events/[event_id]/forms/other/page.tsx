import prisma from "@/prisma-client"
import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/route"
import { getEventMember } from "@/server/module"
import { redirect } from "next/navigation"
import FormConfig from "@/server/classes/forms/formconfig"
import AvailableForms from "@/components/events/event/forms/available-forms"

export default async function AllOtherFormPage({ params }: { params: { [key: string]: string }}){
    const session = await getServerAuthSession()
    const otherForms = await prisma.eventForm.findMany({
        where:{
            event_id: params.event_id,
            type: 'OTHER',
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
        user_id: session?.user?.id ?? '',
        event_id: params.event_id,
    })
    const filteredOtherForms = otherForms.filter((form) => {
        const restrictedAccess = FormConfig.fromDatabase(form).userCanAccess({
            email: session?.user.email ?? '',
            position_id: eventMember?.position_id ?? null,
            role_id: eventMember?.role_id ?? null,
        })
        const generalAccess = form.public || eventMember
        return restrictedAccess || generalAccess
    })
    if(filteredOtherForms.length == 1){
        redirect(`/events/${params.event_id}/forms/${filteredOtherForms[0].id}`)
    }
    return (
        <AvailableForms
            event_id={params.event_id}
            title="Available Join Forms"
            forms={filteredOtherForms}
            linkLabel="Fill"
        />
    )
}