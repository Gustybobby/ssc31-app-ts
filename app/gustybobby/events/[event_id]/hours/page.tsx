import MainWrapper from "@/components/globalui/main-wrapper";
import DashboardWrapper from "@/components/gustybobby/events/event/dashboard-wrapper";
import EventHours from "@/components/gustybobby/events/event/hours/event-hours";
import prisma from "@/prisma-client";

export default async function EventHoursPage({ params }: { params: { event_id: string }}){
    const event = await prisma.event.findUniqueOrThrow({
        where: {
            id: params.event_id
        },
        select: {
            title: true,
            created_at: true,
            members: {
                select: {
                    id: true,
                    act_hrs: true,
                    transfer_records: true,
                }
            }
        }
    })
    const activityHours = Object.fromEntries(event.members.map(({ id, act_hrs, transfer_records }) => {
        let total = 0
        for (const record of Object.values(transfer_records as any ?? {}) as any){
            total += record.hrs
        }
        return [id, act_hrs-total]
    }))
    const transferRecords = Object.fromEntries(event.members.map(({ id, transfer_records }) => [id, transfer_records as any]))
    return (
        <MainWrapper>
            <DashboardWrapper eventId={params.event_id} eventTitle={event.title}>
                <EventHours
                    event_id={params.event_id}
                    eventCreatedAt={event.created_at ?? new Date()}
                    activityHours={activityHours}
                    transferRecords={transferRecords}
                />
            </DashboardWrapper>
        </MainWrapper>
    )
}