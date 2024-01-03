import type { EventMember, PrismaClient } from "@prisma/client"

export async function getEventMember(
    prisma: PrismaClient,
    { user_id, event_id }: { user_id: string, event_id: string },
    select?: { [key in keyof EventMember]?: boolean }
){
    const eventMember = await prisma.eventMember.findFirst({
        where:{
            user_id: user_id,
            event_id: event_id,
        },
        select
    })
    return eventMember
}