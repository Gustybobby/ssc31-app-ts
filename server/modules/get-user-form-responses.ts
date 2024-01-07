import type { EventFormResponse, PrismaClient } from "@prisma/client"

export default async function getUserFormResponses(
    prisma: PrismaClient,
    { user_id, form_id }: { user_id: string, form_id: string },
    select?: { [key in keyof EventFormResponse]?: boolean }
){
    const memberResponses = await prisma.eventFormResponse.findMany({
        where:{
            user_id,
            form_id,
        },
        select
    })
    return memberResponses
}