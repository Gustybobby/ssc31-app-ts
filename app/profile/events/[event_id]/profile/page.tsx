import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils";
import MainWrapper from "@/components/globalui/main-wrapper";
import MemberProfile from "@/components/profile/events/event/profile/member-profile";
import prisma from "@/prisma-client";
import { extractTextFromResponseData } from "@/server/inputfunction";
import type { PrismaFieldConfig } from "@/server/typeconfig/form";

export default async function MemberProfilePage({ params }: { params: { event_id: string }}){
    const session = await getServerAuthSession()
    if(!session?.user.id || !session?.user.role){
        throw 'invalid session'
    }
    const memberProfile = await prisma.eventMember.findFirstOrThrow({
        where: {
            user_id: session.user.id,
            event_id: params.event_id
        },
        select: {
            status: true,
            position: {
                select: {
                    label: true
                }
            },
            role: {
                select: {
                    label: true
                }
            },
            form_responses: {
                where: {
                    form: {
                        type: 'JOIN'
                    }
                },
                select: {
                    response: true,
                    form: {
                        select: {
                            field_order: true,
                            form_fields: true,
                        }
                    }
                }
            },
            event: {
                select: {
                    title: true
                }
            }
        }
    })
    const memberFormResponse = memberProfile.form_responses[0]
    const formFields = memberFormResponse.form.form_fields as { [key: string]: PrismaFieldConfig }
    const response = memberFormResponse.response as { [key: string]: string }
    const joinResponse = memberFormResponse.form.field_order.map((id) => ({
        id,
        label: formFields[id].label,
        data: extractTextFromResponseData(response[id] ?? '')
    })).filter(({ data }) => data !== '')
    console.log(joinResponse)
    return(
        <MainWrapper>
            <MemberProfile
                profile={{
                    status: memberProfile.status,
                    position_label: memberProfile.position?.label ?? '',
                    role_label: memberProfile.role?.label ?? '',
                    join_response: joinResponse

                }}
                event_id={params.event_id}
                event_title={memberProfile.event.title}
            />
        </MainWrapper>
    )
}