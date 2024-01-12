import MainWrapper from "@/components/globalui/main-wrapper"
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
            <EventSchedule event_id={params.event_id} event_title={event.title}/>
        </MainWrapper>
    )
}