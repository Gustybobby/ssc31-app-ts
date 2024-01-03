import MainWrapper from "@/components/globalui/main-wrapper"
import EventFiles from "@/components/gustybobby/events/event/files/event-files"
import prisma from "@/prisma-client"

export default async function EventFilesPage({ params }: { params: { event_id: string } }){
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
            <EventFiles event_id={params.event_id} event_title={event.title}/>
        </MainWrapper>
    )
}