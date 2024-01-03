import MainWrapper from "@/components/globalui/main-wrapper"
import EventDetails from "@/components/gustybobby/events/event/details/event-details"
import prisma from "@/prisma-client"

export default async function EventDetailsPage({ params }: { params: { event_id: string } }){
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
            <EventDetails event_id={params.event_id} event_title={event.title}/>
        </MainWrapper>
    )
}