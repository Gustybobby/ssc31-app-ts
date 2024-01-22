import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/prisma-client";
import { searchParamsToSelect } from "@/server/utils";

export async function GET(req: NextRequest, { params }: { params: { event_id: string }}){
    try{
        const searchParams = req.nextUrl.searchParams
        const select = searchParamsToSelect(searchParams)
        const data = await prisma.eventMember.findMany({
            where: {
                event_id: params.event_id
            },
            select
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
            const position_id = memberData?.position_id === 'NONE'? null : memberData?.position_id
            const role_id = memberData?.role_id === 'NONE'? null : memberData?.role_id
            const updateEventMember = await prisma.eventMember.update({
                where: {
                    id,
                    event_id: params.event_id,
                },
                data: {
                    ...memberData,
                    position_id,
                    role_id,
                }
            })
            console.log('Updated event member', updateEventMember)
        }
        return NextResponse.json({ message: "SUCCESS" }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}