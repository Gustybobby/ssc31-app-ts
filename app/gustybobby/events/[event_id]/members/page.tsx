import MainWrapper from "@/components/globalui/main-wrapper"
import DashboardWrapper from "@/components/gustybobby/events/event/dashboard-wrapper"
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
                            { AND: [
                                { type: 'OTHER' },
                                { public: true },
                            ]}
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
    if(event.forms.length === 0){
        return(
            <MainWrapper>
                <DashboardWrapper eventId={params.event_id} eventTitle={event.title}>
                    <div className="h-[75vh] flex items-center justify-center text-center font-bold text-xl px-8">
                        You have no member associated forms for this event
                    </div>
                </DashboardWrapper>
            </MainWrapper>
        )
    }
    return(
        <MainWrapper>
            <DashboardWrapper eventId={params.event_id} eventTitle={event.title}>
                <EventMembers
                    event_id={params.event_id}
                    forms={event.forms}
                />
            </DashboardWrapper>
        </MainWrapper>
    )
}