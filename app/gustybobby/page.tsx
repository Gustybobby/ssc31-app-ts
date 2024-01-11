import prisma from "@/prisma-client";
import MainWrapper from "@/components/globalui/main-wrapper";
import Gustybobby from "@/components/gustybobby/gustybobby";

export default async function GustybobbyPage(){
    const events = await prisma.event.findMany({
        select: {
            id: true,
            title: true,
            online: true
        }
    })
    return(
        <MainWrapper>
            <Gustybobby events={events}/>
        </MainWrapper>
    )
}