import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/prisma-client";

export async function GET(req: NextRequest, { params }: { params: { event_id: string }}){
    try{
        const data = await prisma.eventMember.findMany({
            where: {
                event_id: params.event_id
            },
            include: {
                position: true,
                role: true,
            }
        })
        return NextResponse.json({ message: "SUCCESS", data }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { event_id: string }}){
    try{
        const memberRequest = await req.json()
        const data = memberRequest.data
        for(const [id, memberData] of Object.entries(data) as any){
            const updateEventMember = await prisma.eventMember.update({
                where: {
                    id,
                    event_id: params.event_id,
                },
                data: { ...memberData }
            })
            console.log('Updated event member', updateEventMember)
        }
        return NextResponse.json({ message: "SUCCESS" }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}