import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/prisma-client";

export async function GET(req: NextRequest, { params }: { params: { form_id: string }}){
    try{
        const formResponses = await prisma.eventFormResponse.findMany({
            where: {
                form_id: params.form_id
            }
        })
        return NextResponse.json({ message: "SUCCESS", data: formResponses }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}