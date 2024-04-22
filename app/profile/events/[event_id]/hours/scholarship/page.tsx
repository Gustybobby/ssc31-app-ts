import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils";
import MainWrapper from "@/components/globalui/main-wrapper";
import ScholarshipForm from "@/components/profile/events/event/hours/scholarship-hours/scholarship-form";
import prisma from "@/prisma-client";
import { redirect } from "next/navigation";

export default async function ScholarshipHoursForm({ params }: { params: { event_id: string }}){
    const session = await getServerAuthSession()
    if (!session?.user.id){
        redirect("/profile")
    }
    const member = await prisma.eventMember.findUniqueOrThrow({
        where: {
            user_id_event_id: {
                user_id: session.user.id,
                event_id: params.event_id
            }
        },
        select: {
            act_hrs: true,
            event: {
                select: {
                    title: true
                }
            }
        }
    })
    return (
        <MainWrapper>
            <ScholarshipForm
                eventId={params.event_id}
                eventTitle={member.event.title}
                activityHours={member.act_hrs}
            />
        </MainWrapper>
    )
}