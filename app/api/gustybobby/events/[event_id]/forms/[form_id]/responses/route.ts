import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/prisma-client";
import { searchParamsToSelect } from "@/server/utils";

export async function GET(req: NextRequest, { params }: { params: { form_id: string }}){
    try{
        const searchParams = req.nextUrl.searchParams
        const select = searchParamsToSelect(searchParams)
        const formResponses = await prisma.eventFormResponse.findMany({
            where: {
                form_id: params.form_id
            },
            orderBy: {
                created_at: 'asc'
            },
            select
        })
        return NextResponse.json({ message: "SUCCESS", data: formResponses }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}