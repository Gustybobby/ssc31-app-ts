import MainWrapper from "@/components/globalui/main-wrapper"
import DashboardWrapper from "@/components/gustybobby/events/event/dashboard-wrapper"
import EventSchedule from "@/components/gustybobby/events/event/schedule/event-schedule"
import prisma from "@/prisma-client"

export default async function EventSchedulePage({ params }: { params: { event_id: string }}){
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
                <EventSchedule event_id={params.event_id}/>
            </DashboardWrapper>
        </MainWrapper>
    )
}