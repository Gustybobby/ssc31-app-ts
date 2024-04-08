import type { ActivityRecord } from "@/server/typeconfig/record"
import { NextResponse, type NextRequest } from "next/server"
import prisma from "@/prisma-client"

export async function POST(req: NextRequest, { params }: { params: { event_id: string, member_id: string }}){
    try {
        const request = await req.json()
        const data = request.data as ActivityRecord[]
        const member = await prisma.eventMember.findUniqueOrThrow({
            where: {
                id: params.member_id
            },
            select: {
                act_hrs: true,
                act_records: true
            }
        })
        member.act_records = member.act_records ?? {}
        const currentRecords = member.act_records as any as { [appt_id: string]: ActivityRecord }
        for (const record of data){
            currentRecords[record.appt_id] = record
        }
        let hrs = 0
        for (const record of Object.values(currentRecords)){
            hrs += record.hrs
        }
        const updatedMember = await prisma.eventMember.update({
            where: {
                id: params.member_id
            },
            data: {
                act_hrs: hrs,
                act_records: currentRecords as any,
            },
            select: {
                id: true,
                act_hrs: true,
                act_records: true,
            }
        })
        console.log(updatedMember)
        return NextResponse.json({ message: "SUCCESS" }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}