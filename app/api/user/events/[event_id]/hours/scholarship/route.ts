import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils";
import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/prisma-client";
import { TransferRecord } from "@/server/typeconfig/record";

export async function POST(req: NextRequest, { params }: { params: { event_id: string }}){
    const session = await getServerAuthSession()
    if (!session?.user.id){
        console.log("Unauthorized")
        return NextResponse.json({ message: "UNAUTHORIZED" }, { status: 400 })
    }
    const member = await prisma.eventMember.findUniqueOrThrow({
        where: {
            user_id_event_id: {
                user_id: session.user.id,
                event_id: params.event_id,
            }
        },
        select: {
            id: true,
            act_hrs: true
        }
    })
    const request = await req.json()
    const records: TransferRecord[] = request.data
    const transferMap: { [key: string]: TransferRecord } = {}
    let total = 0
    for (const record of records){
        transferMap[`${record.semester}_${record.year}`] = record
        total += record.hrs
    }
    if (total > member.act_hrs){
        console.log("Invalid Hours")
        return NextResponse.json({ message: "ERROR" }, { status: 400 })
    }
    const updatedMember = await prisma.eventMember.update({
        where: {
            id: member.id
        },
        data: {
            transfer_records: transferMap as any
        },
        select: {
            id: true,
            transfer_records: true,
        }
    })
    console.log(session.user.email,"transferred hours")
    console.log(updatedMember)
    return NextResponse.json({ message: "SUCCESS" }, { status: 200 })
}