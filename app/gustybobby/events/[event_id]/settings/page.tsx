import MainWrapper from "@/components/globalui/main-wrapper"
import EventSettings from "@/components/gustybobby/events/event/settings/event-settings"
import prisma from "@/prisma-client"

export default async function EventSettingsPage({ params }: { params: { event_id: string } }){
    const event = await prisma.event.findUnique({
        where:{
            id: params.event_id
        },
        select:{
            title: true
        }
    })
    if(!event){
        return <></>
    }
    return(
        <MainWrapper>
            <EventSettings event_id={params.event_id} event_title={event.title}/>
        </MainWrapper>
    )
}