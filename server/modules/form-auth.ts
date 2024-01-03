import type { EventFormRow, EventMember, PrismaClient } from "@prisma/client"
import EventConfig from "../classes/eventconfig"
import FormConfig from "../classes/forms/formconfig"
import { getEventMember } from "./get-event-member"
import { getMemberFormResponses } from "./get-member-form-responses"
import { getPrismaFields } from "../typeconfig/form"

interface BadFormAuthResponse {
    message: "INVALID" | "UNAUTHORIZED" | "PRIVATE_FORM" | "MEMBER_EXISTED"
}

interface ResponseExistedAuthResponse {
    message: "RESPONSE_EXISTED"
    member_info: EventMember
    member_responses: EventFormRow[] 
}

interface SuccessAuthResponse {
    message: "SUCCESS"
    member_info: EventMember | null
    member_responses: EventFormRow[]
    event_config: EventConfig
    form_config: FormConfig
}

type FormAuthResponse = BadFormAuthResponse | ResponseExistedAuthResponse | SuccessAuthResponse

export async function formAuth(
    prisma: PrismaClient,
    isAdmin: boolean,
    {
        user_id,
        user_email,
        event_id,
        form_id
    }: {
        user_id: string,
        user_email: string,
        event_id: string,
        form_id: string
    }
): Promise<FormAuthResponse>{
    const eventInfo = await prisma.event.findUnique({
        where: {
            id: event_id
        },
        select:{
            id: true,
            positions: {
                where:{
                    open: true,
                },
                orderBy:{
                    order: 'asc'
                }
            },
            roles: {
                orderBy:{
                    order: 'asc'
                }
            },
        }
    })
    const userMemberInfo = await getEventMember(prisma, { user_id, event_id })
    const formInfo = await prisma.eventForm.findUnique({
        where:{
            id: form_id
        },
        select:{
            id: true,
            title: true,
            description: true,
            type: true,
            response_type: true,
            open: true,
            public: true,
            email_restricts: true,
            position_restricts: true,
            role_restricts: true,
            field_order: true,
            form_fields: true,
        },
    })
    if(!eventInfo || !formInfo){
        return { message: "INVALID" }
    }
    const eventConfig = new EventConfig(eventInfo)
    const formConfig = FormConfig.fromDatabase({ ...formInfo, form_fields: getPrismaFields(formInfo.form_fields) })
    if(!formConfig.userCanAccess({
        email: user_email,
        position_id: userMemberInfo?.position_id ?? null,
        role_id: userMemberInfo?.role_id ?? null,
    })){
        return { message: "UNAUTHORIZED" }
    }
    if(!formConfig.open && !isAdmin){
        return { message: "UNAUTHORIZED" }
    }
    if(!formConfig.public && !userMemberInfo){
        return { message: "PRIVATE_FORM" }
    }
    if(formConfig.type === 'JOIN' && userMemberInfo){
        return { message: "MEMBER_EXISTED" }
    }
    const memberResponses = userMemberInfo? await getMemberFormResponses(prisma, { member_id: userMemberInfo.id, form_id }) : []
    if(formConfig.response_type === 'SINGLE' && userMemberInfo && memberResponses.length > 0){
        return {
            message: "RESPONSE_EXISTED",
            member_info: userMemberInfo,
            member_responses: memberResponses,
        }
    }
    return { 
        message: "SUCCESS",
        event_config: eventConfig,
        form_config: formConfig,
        member_info: userMemberInfo,
        member_responses: memberResponses
    }
}
