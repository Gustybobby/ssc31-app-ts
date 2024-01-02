import prisma from "@/prisma-client"
import MainWrapper from "@/components/globalui/main-wrapper"
import EventPreview from "@/components/events/event-preview"

export const revalidate = 30

export default async function EventsPage(){
    const events = await prisma.event.findMany({
        where:{
            online: true,
        },
        select:{
            id: true,
            title: true,
            poster: true,
        },
    })
    if (events?.length === 0){
        return(
            <MainWrapper extraClass={"justify-center"}>
                <h1 className="text-3xl text-center font-bold">
                    No Event<br/>Currently <br/>Available
                </h1>
            </MainWrapper>
        )
    }
    return(
        <MainWrapper>
        {events.map((event) => (
            <div className="flex flex-col items-center w-11/12 md:w-3/4 my-8 space-y-4" key={event.id}>
                <EventPreview
                    id={event.id}
                    title={event.title}
                    poster={event.poster}
                />
            </div>
        ))}
        </MainWrapper>
    )
}