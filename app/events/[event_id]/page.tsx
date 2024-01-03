import EventDetailedPost from "@/components/events/event/event-detailed-post"
import MainWrapper from "@/components/globalui/main-wrapper"
import prisma from "@/prisma-client"

export default async function EventPage({ params } : { params: { event_id: string }}){
    const event = await prisma.event.findUniqueOrThrow({
        where: {
            id : params.event_id
        },
        select:{
            id: true,
            title: true,
            poster: true,
            description: true,
        },
    })
    return(
        <MainWrapper>
            <EventDetailedPost
                id={event.id}
                title={event.title}
                poster={event.poster}
                description={event.description}
            />
        </MainWrapper>
    )
}