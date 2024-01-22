import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils";
import { redirect } from "next/navigation";
import prisma from "@/prisma-client";
import type { PrismaFieldConfig } from "@/server/typeconfig/form";
import MainWrapper from "@/components/globalui/main-wrapper";
import FormResponses from "@/components/events/event/forms/form/responses/form-responses";
import { compoundAccessEvaluation } from "@/server/utils";

export default async function FormResponsesPage({ params }: { params: { event_id: string, form_id: string }}){
    const session = await getServerAuthSession()
    if(!session?.user.id){
        redirect('/events')
    }
    const member = session.user.role === 'ADMIN' ? 'ADMIN' : await prisma.eventMember.findUniqueOrThrow({
        where: {
            user_id_event_id: {
                user_id: session.user.id,
                event_id: params.event_id
            }
        },
        select: {
            status: true,
            position_id: true,
            role_id: true,
        }
    })
    if(member !== 'ADMIN' && member.status !== 'ACTIVE'){
        redirect('/events')
    }
    const { responses_list, ...form } = await prisma.eventForm.findUniqueOrThrow({
        where: {
            id: params.form_id
        },
        select: {
            id: true,
            title: true,
            global_position_access: {
                select: {
                    id: true,
                },
            },
            global_role_access: {
                select: {
                    id: true,
                },
            },
            form_fields: true,
            field_order: true,
            responses_list: {
                orderBy: {
                    created_at: 'asc'
                },
                select: {
                    id: true,
                    form_id: true,
                    member_id: true,
                    response: true,
                    member: {
                        select: {
                            id: true,
                            status: true,
                            position: {
                                select: {
                                    id: true,
                                    label: true,
                                }
                            },
                            role: {
                                select: {
                                    id: true,
                                    label: true,
                                }
                            }
                        }
                    }
                }
            },
        }
    })
    if(member === 'ADMIN'){
        return (
            <MainWrapper>
                <FormResponses
                    event_id={params.event_id}
                    role="gustybobby"
                    formConfig={form as any}
                    responses={responses_list as any}
                />
            </MainWrapper>
        )
    }
    const hasGlobalAccess = compoundAccessEvaluation({
        role_access: form.global_role_access.map(({ id }) => id),
        position_access: form.global_position_access.map(({ id }) => id),
        role_id: member.role_id,
        position_id: member.position_id,
    })
    if(hasGlobalAccess){
        return (
            <MainWrapper>
                <FormResponses
                    event_id={params.event_id}
                    role="user"
                    formConfig={form as any}
                    responses={responses_list as any}
                />
            </MainWrapper>
        )
    }
    const filteredFormFields = Object.fromEntries(Object.entries(form.form_fields ?? {}).filter(([_, field]) => {
        const fieldConfig = field as PrismaFieldConfig
        return compoundAccessEvaluation({
            role_access: fieldConfig.role_access,
            position_access: fieldConfig.position_access,
            role_id: member.role_id,
            position_id: member.position_id,
        })
    }))
    const filteredFieldOrder = form.field_order.filter((field_id) => !!filteredFormFields[field_id])
    if(filteredFieldOrder.length === 0){
        redirect('/events')
    }
    form.form_fields = filteredFormFields
    form.field_order = filteredFieldOrder
    return (
        <MainWrapper>
            <FormResponses
                event_id={params.event_id}
                role="user"
                formConfig={form as any}
                responses={responses_list as any}
            />
        </MainWrapper>
    )
}