import MainWrapper from "@/components/globalui/main-wrapper"
import EventMembers from "@/components/gustybobby/events/event/members/event-members"
import prisma from "@/prisma-client"

export default async function EventMembersPage({ params }: { params: { event_id: string } }){
    const event = await prisma.event.findUniqueOrThrow({
        where:{
            id: params.event_id
        },
        select:{
            title: true,
            forms: {
                where: {
                    NOT: {
                        OR: [
                            { type: 'EVALUATE' },
                            { response_type: 'MULTIPLE' },
                        ]
                    }
                },
                select: {
                    id: true,
                    title: true,
                }
            }
        }
    })
    return(
        <MainWrapper>
            <EventMembers
                event_id={params.event_id}
                event_title={event.title}
                forms={event.forms}
            />
        </MainWrapper>
    )
}