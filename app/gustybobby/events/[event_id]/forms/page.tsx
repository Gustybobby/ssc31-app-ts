import MainWrapper from "@/components/globalui/main-wrapper"
import DashboardWrapper from "@/components/gustybobby/events/event/dashboard-wrapper"
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
            <DashboardWrapper eventId={params.event_id} eventTitle={event.title}>
                <EventForms event_id={params.event_id}/>
            </DashboardWrapper>
        </MainWrapper>
    )
}