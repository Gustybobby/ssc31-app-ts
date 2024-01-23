import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils";
import { redirect } from "next/navigation";
import prisma from "@/prisma-client";
import { compoundAccessEvaluation } from "@/server/utils";
import type { FormResponse, PrismaFieldConfig } from "@/server/typeconfig/form";
import MainWrapper from "@/components/globalui/main-wrapper";
import MemberForms from "@/components/profile/events/event/forms/member-forms";
import type { Prisma } from "@prisma/client";

export default async function MemberFormsPage({ params }: { params: { event_id: string }}){
    const session = await getServerAuthSession()
    if(!session?.user.id){
        redirect('/profile')
    }
    const { form_responses, ...member } = await prisma.eventMember.findUniqueOrThrow({
        where: {
            user_id_event_id: {
                user_id: session.user.id,
                event_id: params.event_id,
            }
        },
        select: {
            status: true,
            position_id: true,
            role_id: true,
            form_responses: {
                select: {
                    id: true,
                    created_at: true,
                    snapshot: true,
                    form: {
                        select: {
                            id: true,
                            title: true,
                            form_fields: true,
                            field_order: true,
                        }
                    }
                }
            }
        }
    })
    if(member.status !== 'ACTIVE'){
        const { id: event_id, title: event_title } = await prisma.event.findUniqueOrThrow({
            where: {
                id: params.event_id
            },
            select: {
                id: true,
                title: true,
            }
        })
        return (
            <MainWrapper>
                <MemberForms
                    forms={[]}
                    responses={publicFormResponses(form_responses)}
                    event_id={event_id}
                    event_title={event_title}
                />
            </MainWrapper>
        )
    }
    const { id: event_id, title: event_title, forms } = await prisma.event.findUniqueOrThrow({
        where: {
            id: params.event_id
        },
        select: {
            id: true,
            title: true,
            forms: {
                where: {
                    event_id: params.event_id
                },
                orderBy: {
                    created_at: 'desc'
                },
                select: {
                    id: true,
                    title: true,
                    global_position_access: {
                        select: {
                            id: true
                        }
                    },
                    global_role_access: {
                        select: {
                            id: true
                        }
                    },
                    form_fields: true,
                }
            }
        }
    })
    const filteredForms = forms.filter((form) => {
        const hasGlobalAccess = compoundAccessEvaluation({
            role_access: form.global_role_access.map(({ id }) => id),
            position_access: form.global_position_access.map(({ id }) => id),
            position_id: member.position_id,
            role_id: member.role_id,
        })
        if(hasGlobalAccess){
            return true
        }
        for(const field of Object.values(form.form_fields as { [key: string]: PrismaFieldConfig })){
            const hasFieldAccess = compoundAccessEvaluation({
                role_access: field.role_access,
                position_access: field.position_access,
                position_id: member.position_id,
                role_id: member.role_id,
            })
            if(hasFieldAccess){
                return true
            }
        }
        return false
    })
    return (
        <MainWrapper>
            <MemberForms
                forms={filteredForms as any}
                responses={publicFormResponses(form_responses)}
                event_id={event_id}
                event_title={event_title}
            />
        </MainWrapper>
    )
}

function publicFormResponses(form_responses: {
    id: string
    created_at: Date | null
    snapshot: Prisma.JsonValue
    form: {
        id: string
        title: string
        field_order: string[]
        form_fields: Prisma.JsonValue
    }
}[]
){
    return form_responses.map((response) => {
        const formFields = response.form.form_fields as { [key: string]: PrismaFieldConfig }
        return {
            ...response,
            snapshot: response.snapshot as FormResponse,
            form: {
                ...response.form,
                form_fields: Object.fromEntries(Object.entries(formFields).map(([field_id, field]) => [
                    field_id,
                    {
                        id: field.id,
                        label: field.label,
                        data_type: field.data_type,
                        field_type: field.field_type,
                    }
                ]))
            }
        }
    })
}