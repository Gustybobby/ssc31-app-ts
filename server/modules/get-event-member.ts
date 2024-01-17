import type { EventMember, PrismaClient } from "@prisma/client"

export default async function getEventMember(
    prisma: PrismaClient,
    { user_id, event_id }: { user_id: string, event_id: string },
    select?: { [key in keyof EventMember]?: boolean }
){
    const eventMember = await prisma.eventMember.findUnique({
        where:{
            user_id_event_id: {
                user_id,
                event_id,
            }
        },
        select
    })
    return eventMember
}