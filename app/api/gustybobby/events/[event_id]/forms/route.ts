import prisma from "@/prisma-client";
import { searchParamsToSelect } from "@/server/utils";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { event_id: string }}){
    try{
        const searchParams = req.nextUrl.searchParams
        const selectParams = searchParamsToSelect(searchParams)
        const { count_res, other_selects: select } = countResponse(selectParams)
        const data = await prisma.eventForm.findMany({
            where: {
                event_id: params.event_id
            },
            select: select? {
                ...select,
                _count: count_res? {
                    select: {
                        row_list: true
                    }
                } : false
            } : undefined,
            orderBy: {
                updated_at: 'desc'
            }
        })
        return NextResponse.json({ message: "SUCCESS", data }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}

function countResponse(select: { [key: string]: boolean } | undefined){
    let count_response = false, other_selects = select
    if(select?.count_res){
        const { count_res, ...otherSelects } = select
        count_response = true
        other_selects = otherSelects
    }
    return { count_res: count_response, other_selects }
}