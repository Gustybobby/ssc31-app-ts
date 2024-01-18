import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils";
import MainWrapper from "@/components/globalui/main-wrapper";
import MemberSchedule from "@/components/profile/events/event/profile/member-schedule";
import prisma from "@/prisma-client";

export default async function MemberSchedulePage({ params }: { params: { event_id: string }}){
    const session = await getServerAuthSession()
    if(!session?.user.id || !session?.user.role){
        throw 'invalid session'
    }
    const member = await prisma.eventMember.findUniqueOrThrow({
        where: {
            user_id_event_id: {
                user_id: session.user.id,
                event_id: params.event_id,
            }
        },
        select: {
            role: {
                select: {
                    can_appoint: true
                }
            },
            position: {
                select: {
                    can_regist: true
                }
            },
            event: {
                select: {
                    title: true
                }
            }
        }
    })
    return(
        <MainWrapper>
            <MemberSchedule
                event_id={params.event_id}
                event_title={member.event.title}
                can_appoint={!!member.role?.can_appoint}
                can_regist={!!member.position?.can_regist}
            />
        </MainWrapper>
    )
}