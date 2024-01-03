import type { EventFormRow, PrismaClient } from "@prisma/client"

export async function getMemberFormResponses(
    prisma: PrismaClient,
    { member_id, form_id }: { member_id: string, form_id: string },
    select?: { [key in keyof EventFormRow]?: boolean }
){
    const memberResponses = await prisma.eventFormRow.findMany({
        where:{
            member_id,
            form_id,
        },
        select
    })
    return memberResponses
}