import formAuth from "@/server/modules/form-auth"
import prisma from "@/prisma-client"
import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils"
import { eventStyles } from "@/components/styles/events"
import MainWrapper from "@/components/globalui/main-wrapper"
import { redirect } from "next/navigation"
import EventForm from "@/components/events/event/forms/form/event-form"

export default async function EventFormPage({ params }: { params: { event_id: string, form_id: string }}){
    const session = await getServerAuthSession()
    if(!session?.user.id || !session?.user.email){
        throw 'UNAUTHORIZED'
    }
    const form = await formAuth(prisma, session?.user.role === 'ADMIN', {
        user_id: session.user.id,
        user_email: session.user.email,
        event_id: params.event_id,
        form_id: params.form_id,
    })
    switch(form.message){
        case "INVALID":
            redirect(`/events`)
        case "CLOSED":
            return (
                <FormMessage>
                    The form has been closed.
                </FormMessage>
            )
        case "UNAUTHORIZED":
            return (
                <FormMessage>
                    You do not have permission to access this form.<br/>Try signing in with SIIT email.
                </FormMessage>
            )
        case "MEMBER_EXISTED":
        case "RESPONSE_EXISTED":
        case "SUCCESS":
            return(
                <MainWrapper>
                    <EventForm
                        event_config={{...form.event_config}}
                        form_config={{...form.form_config.getPublicConfig()}}
                        submitted={form.message !== "SUCCESS"}
                    />
                </MainWrapper>
            )
    }
}

function FormMessage({ children }: { children: React.ReactNode }){
    return(
        <MainWrapper>
            <div className={eventStyles.box({ size: 'sm', round: true, extensions: 'my-4 p-4 text-2xl font-bold text-center' })}>
                {children}
            </div>
        </MainWrapper>
    )
}