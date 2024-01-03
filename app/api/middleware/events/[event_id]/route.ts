import prisma from "@/prisma-client"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { event_id: string }}){
    try{
        const { id } = await prisma.event.findUnique({
            where: {
                id: params.event_id
            },
            select: {
                id: true
            }
        }) ?? { id: null }
        return NextResponse.json({ message: "SUCCESS", data: id }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}