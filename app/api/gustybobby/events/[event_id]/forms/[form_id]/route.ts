import prisma from "@/prisma-client";
import type { FormConfigProperty } from "@/server/classes/forms/formconfig";
import { searchParamsToSelect } from "@/server/utils";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { event_id: string, form_id: string }}){
    try{
        const searchParams = req.nextUrl.searchParams
        const select = searchParamsToSelect(searchParams)
        let data
        if(select){
            data = await prisma.eventForm.findUniqueOrThrow({
                where: {
                    id: params.form_id
                },
                select,
            })
        } else{
            data = await prisma.eventForm.findUniqueOrThrow({
                where: {
                    id: params.form_id
                },
                include: {
                    global_position_access: true,
                    global_role_access: true,
                    position_restricts: true,
                    role_restricts: true
                }
            })
        }
        return NextResponse.json({ message: "SUCCESS", data }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: { form_id: string }}){
    try{
        const formRequest = await req.json()
        const formData = formRequest.data as FormConfigProperty
        const { id, ...data } = formData
        const editedForm = await prisma.eventForm.update({
            where: {
                id: params.form_id
            },
            data: {
                title: data.title,
                type: data.type,
                open: data.open,
                public: data.public,
                response_type: data.response_type,
                description: data.description,
                submitted_area: data.submitted_area,
                field_order: data.field_order,
                form_fields: data.form_fields as any,
                email_restricts: data.email_restricts,
                global_position_access: { set: data.global_position_access ?? [] },
                global_role_access: { set: data.global_role_access ?? [] },
                position_restricts: { set: data.position_restricts ?? [] },
                role_restricts: { set: data.role_restricts?? [] },
            }
        })
        console.log("Edited form", editedForm)
        return NextResponse.json({ message: "SUCCESS" }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { form_id: string }}){
    try{
        await prisma.eventForm.delete({
            where: {
                id: params.form_id
            }
        })
        console.log("Deleted Form", params.form_id)
        return NextResponse.json({ message: "SUCCESS" }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}