import MainWrapper from "@/components/globalui/main-wrapper"
import EventForms from "@/components/gustybobby/events/event/forms/event-forms"
import prisma from "@/prisma-client"

export default async function EventFormsPage({ params }: { params: { event_id: string } }){
    const event = await prisma.event.findUniqueOrThrow({
        where:{
            id: params.event_id
        },
        select:{
            title: true
        }
    })
    return(
        <MainWrapper>
            <EventForms event_id={params.event_id} event_title={event.title}/>
        </MainWrapper>
    )
}