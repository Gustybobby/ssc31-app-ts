import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils";
import MainWrapper from "@/components/globalui/main-wrapper";
import MemberHours from "@/components/profile/events/event/hours/member-hours";
import prisma from "@/prisma-client";
import { redirect } from "next/navigation";

export default async function HoursPage({ params }: { params: { member_id: string }}){
    const session = await getServerAuthSession()
    if(!session?.user.id || !session?.user.role){
        redirect('/profile')
    }
    const member = await prisma.eventMember.findUniqueOrThrow({
        where: {
            id: params.member_id
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
        }
    })
    return(
        <MainWrapper>
            <div className="w-full">
                <MemberHours activityRecords={member.act_records as any} activityHours={member.act_hrs}/>
            </div>
        </MainWrapper>
    )
}