import type { EventFormResponse, EventMember, PrismaClient } from "@prisma/client"
import EventConfig from "../classes/eventconfig"
import FormConfig from "../classes/forms/formconfig"
import getEventMember from "./get-event-member"
import { getPrismaFields } from "../typeconfig/form"
import getUserFormResponses from "./get-user-form-responses"

interface BadFormAuthResponse {
    message: "INVALID" | "UNAUTHORIZED"
}

interface GoodFormAuthResponse {
    message: "SUCCESS" | "MEMBER_EXISTED" | "RESPONSE_EXISTED"
    member_info: EventMember | null
    member_responses: EventFormResponse[]
    event_config: EventConfig
    form_config: FormConfig
}

type FormAuthResponse = BadFormAuthResponse | GoodFormAuthResponse

export default async function formAuth(
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
    const eventInfo = await prisma.event.findUniqueOrThrow({
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
    const formInfo = await prisma.eventForm.findUniqueOrThrow({
        where:{
            id: form_id
        },
        select:{
            id: true,
            title: true,
            description: true,
            submitted_area: true,
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
    if(!formConfig.public && !userMemberInfo && !isAdmin){
        return { message: "UNAUTHORIZED" }
    }
    const userResponses = await getUserFormResponses(prisma, { user_id, form_id })
    let message = "SUCCESS" as GoodFormAuthResponse['message']
    if(formConfig.type === 'JOIN' && userMemberInfo){
        message = "MEMBER_EXISTED"
    }
    else if(formConfig.response_type === 'SINGLE' && userResponses.length > 0){
        message = "RESPONSE_EXISTED"
    }
    return { 
        message,
        event_config: eventConfig,
        form_config: formConfig,
        member_info: userMemberInfo,
        member_responses: userMemberInfo? userResponses : []
    }
}
