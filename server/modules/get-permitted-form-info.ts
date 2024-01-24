import type { FormType, MemberStatus, PrismaClient } from "@prisma/client";
import { compoundAccessEvaluation } from "../utils";
import type { FormResponse, PrismaFieldConfig } from "../typeconfig/form";

export default async function getPermittedFormInfo(prisma: PrismaClient, {
    user_id, event_id, form_id }: { user_id: string, event_id: string, form_id: string },
    isAdmin: boolean,
    formWhereInput?: {
        id: string,
        type?: FormType,
    },
    responseWhereInput?: any,
    extendedMemberAuth?: (member: {
        status: MemberStatus,
        position: { can_regist: boolean } | null,
        role: { can_appoint: boolean } | null,
        position_id: string | null,
        role_id: string | null,
    } | 'ADMIN') => boolean
){
    try{
        const member = isAdmin? 'ADMIN' : await prisma.eventMember.findUniqueOrThrow({
            where: {
                user_id_event_id: { user_id, event_id }
            },
            select: {
                status: true,
                position: {
                    select: {
                        can_regist: true,
                    },
                },
                position_id: true,
                role: {
                    select: {
                        can_appoint: true,
                    }
                },
                role_id: true,
            }
        })
        if(member !== 'ADMIN' && member.status !== 'ACTIVE'){
            throw 'UNAUTHORIZED'
        }
        if(extendedMemberAuth && !extendedMemberAuth(member)){
            throw 'UNAUTHORIZED'
        }
        const { responses_list, global_position_access, global_role_access, ...form } = await prisma.eventForm.findUniqueOrThrow({
            where: formWhereInput ?? {
                id: form_id
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
                    where: responseWhereInput,
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
        if(member === "ADMIN"){
            return {
                type: "ADMIN",
                form_config: {
                    ...form,
                    form_fields: form.form_fields as { [key: string]: PrismaFieldConfig }
                },
                responses: responses_list,
            }
        }
        const hasGlobalAccess = compoundAccessEvaluation({
            role_access: global_role_access.map(({ id }) => id),
            position_access: global_position_access.map(({ id }) => id),
            role_id: member.role_id,
            position_id: member.position_id,
        })
        if(!hasGlobalAccess){
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
                throw 'UNAUTHORIZED'
            }
            form.form_fields = filteredFormFields
            form.field_order = filteredFieldOrder
        }
        return {
            type: "MEMBER",
            form_config: {
                ...form,
                form_fields: Object.fromEntries(Object.entries((form.form_fields as { [key: string]: PrismaFieldConfig }))
                    .map(([field_id, field]) => [
                        field_id,
                        {
                            ...field,
                            position_access: [],
                            role_access: [],
                        }
                    ]))
            },
            responses: responses_list,
        }
    } catch(e){
        console.log(e)
        return {
            type: 'UNAUTHORIZED'
        }
    }
}

export interface SelectionResponse {
    form_id: string
    id: string
    member_id: string
    response: FormResponse
    member: {
        role: {
            label: string
            id: string
        } | null
        status: MemberStatus
        id: string
        position: {
            label: string
            id: string
        } | null
    } | null
}[]