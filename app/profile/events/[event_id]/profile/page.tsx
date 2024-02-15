import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils";
import MainWrapper from "@/components/globalui/main-wrapper";
import MemberDashboardWrapper from "@/components/profile/events/event/member-dashboard-wrapper";
import MemberProfile from "@/components/profile/events/event/profile/member-profile";
import prisma from "@/prisma-client";
import { extractTextFromResponseData } from "@/server/inputfunction";
import type { PrismaFieldConfig } from "@/server/typeconfig/form";
import { redirect } from "next/navigation";

export default async function MemberProfilePage({ params }: { params: { event_id: string }}){
    const session = await getServerAuthSession()
    if(!session?.user.id || !session?.user.role){
        redirect('/profile')
    }
    const memberProfile = await prisma.eventMember.findUniqueOrThrow({
        where: {
            user_id_event_id: {
                user_id: session.user.id,
                event_id: params.event_id
            },
            status: {
                not: "REJECTED"
            }
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
        data: extractTextFromResponseData(response[id] ?? '', formFields[id].field_type)
    })).filter(({ data }) => data !== '')
    return(
        <MainWrapper>
            <MemberDashboardWrapper
                eventId={params.event_id}
                eventTitle={memberProfile.event.title}
            >
                <MemberProfile
                    profile={{
                        status: memberProfile.status,
                        position_label: memberProfile.position?.label ?? '',
                        role_label: memberProfile.role?.label ?? '',
                        join_response: joinResponse
                    }}
                />
            </MemberDashboardWrapper>
        </MainWrapper>
    )
}