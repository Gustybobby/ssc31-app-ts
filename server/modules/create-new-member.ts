import type { MemberStatus, PrismaClient } from "@prisma/client"
import type { ActivityRecord, TransferRecord } from "../typeconfig/record"

interface OptionalMemberData {
    status?: MemberStatus
    act_hrs?: number
    act_records?: ActivityRecord[]
    transfer_records?: TransferRecord[]
    position_id?: string | null
    role_id?: string | null
}

export default async function createNewEventMember(
    prisma: PrismaClient,
    { 
        user_id,
        event_id,
        memberParams,
    }: {
        user_id: string,
        event_id: string,
        memberParams?: OptionalMemberData
    }
){
    const newEventMember = await prisma.eventMember.create({ 
        data:{
            ...memberParams,
            user_id: user_id,
            event_id: event_id,
        } as any
    })
    console.log('Created New Event Member', newEventMember)
    return newEventMember
}