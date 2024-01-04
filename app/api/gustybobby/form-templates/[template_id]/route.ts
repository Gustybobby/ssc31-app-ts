import prisma from "@/prisma-client";
import { type NextRequest, NextResponse } from "next/server";

//get form template
export async function GET(req: NextRequest, { params }: { params: { template_id: string }}){
    try{
        const formTemplate = await prisma.eventFormTemplate.findUnique({
            where:{
                id: Number(params.template_id)
            }
        })
        return NextResponse.json({ data: formTemplate, message: "SUCCESS" }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}