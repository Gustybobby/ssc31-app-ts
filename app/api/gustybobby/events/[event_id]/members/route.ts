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