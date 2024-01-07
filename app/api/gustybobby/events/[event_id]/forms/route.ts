import prisma from "@/prisma-client";
import FormConfig from "@/server/classes/forms/formconfig";
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
                        responses_list: true
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

export async function POST(req: NextRequest, { params }: { params: { event_id: string }}){
    try{
        const newFormRequest = await req.json()
        console.log("Recieved request", newFormRequest)
        const formConfig: FormConfig = new FormConfig(newFormRequest.data)
        formConfig.validateFormFields()
        const newForm = await prisma.eventForm.create({
            data: {
                ...formConfig,
                title: formConfig.title ?? 'Untitled Form',
                field_order: formConfig.field_order ?? [],
                form_fields: formConfig.form_fields as any,
                position_restricts: { connect: formConfig.position_restricts },
                role_restricts: { connect: formConfig.role_restricts },
                global_position_access: { connect: formConfig.global_position_access },
                global_role_access: { connect: formConfig.global_role_access },
                event_id: params.event_id
            }
        })
        console.log('Created New Form', newForm)
        return NextResponse.json({ message: "SUCCESS", data: { form_id: newForm.id } }, { status: 401 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 400 })
    }
}