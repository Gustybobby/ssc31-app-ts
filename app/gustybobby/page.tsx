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
            <div className="w-full flex flex-col items-center">
                <Gustybobby events={events}/>
            </div>
        </MainWrapper>
    )
}