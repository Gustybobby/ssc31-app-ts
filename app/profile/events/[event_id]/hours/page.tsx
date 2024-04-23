import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils";
import MainWrapper from "@/components/globalui/main-wrapper";
import MemberHours from "@/components/profile/events/event/hours/member-hours";
import MemberDashboardWrapper from "@/components/profile/events/event/member-dashboard-wrapper";
import prisma from "@/prisma-client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"

export default async function MemberHoursPage({ params }: { params: { event_id: string }}){
    const session = await getServerAuthSession()
    if(!session?.user.id || !session?.user.role){
        redirect('/profile')
    }
    const member = await prisma.eventMember.findUniqueOrThrow({
        where: {
            user_id_event_id: {
                user_id: session.user.id,
                event_id: params.event_id,
            },
            status: {
                not: "REJECTED"
            }
        },
        select: {
            status: true,
            event: {
                select: {
                    title: true
                }
            },
            act_hrs: true,
            act_records: true,
            transfer_records: true,
        }
    })
    return(
        <MainWrapper>
            <MemberDashboardWrapper
                eventId={params.event_id}
                eventTitle={member.event.title}
            >
                <MemberHours
                    activityRecords={member.act_records as any ?? {}}
                    transferRecords={member.transfer_records as any ?? {}}
                    activityHours={member.act_hrs}
                />
            </MemberDashboardWrapper>
        </MainWrapper>
    )
}