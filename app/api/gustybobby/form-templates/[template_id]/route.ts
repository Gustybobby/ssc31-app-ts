import prisma from "@/prisma-client";
import { type NextRequest, NextResponse } from "next/server";

//get form template
export async function GET(req: NextRequest, { params }: { params: { template_id: string }}){
    try{
        const formTemplate = await prisma.eventFormTemplate.findUniqueOrThrow({
            where:{
                id: Number(params.template_id)
            }
        })
        const min_length = formTemplate?.min_length.map((value) => String(value))
        const max_length = formTemplate?.max_length.map((value) => String(value))
        return NextResponse.json({ data: { ...formTemplate, min_length, max_length }, message: "SUCCESS" }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}