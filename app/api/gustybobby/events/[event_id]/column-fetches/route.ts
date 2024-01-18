import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/prisma-client";
import type { ColumnFetches, TableView } from "@/server/typeconfig/event";
import type { MemberReferencedResponses } from "@/server/typeconfig/table";
import type { FormResponse, PrismaFieldConfig } from "@/server/typeconfig/form";
import { ColumnProperty } from "@/server/classes/table";

export async function GET(req: NextRequest, { params }: { params: { event_id: string }}){
    try{
        const searchParams = req.nextUrl.searchParams
        const table_view = searchParams.get('table_view')
        const event = await prisma.event.findUniqueOrThrow({
            where:{
                id: params.event_id
            },
            select: {
                column_fetches: true
            }
        })
        const column_fetches = filteredColumnFetches(event.column_fetches as ColumnFetches, table_view as TableView | null)
        const groups: ColumnProperty[] = []
        const group_responses: MemberReferencedResponses = {}
        const forms = await getAllRequiredForms(column_fetches)
        for(const [group_id, group] of Object.entries(column_fetches ?? {})){
            let dataType = null
            let fieldType = null
            for(const [form_id, field_id] of Object.entries(group.forms)){
                const form = forms[form_id]
                const formFields = form.form_fields as { [key: string]: PrismaFieldConfig }
                const { data_type: newDataType, field_type: newFieldType } = formFields[field_id]
                if((dataType || fieldType) && (newDataType !== dataType || newFieldType !== fieldType)){
                    throw `group ${group_id} has inconsistent data type and field type`
                }
                dataType = newDataType
                fieldType = newFieldType
                for(const formResponse of form.responses_list){
                    if(!formResponse.member_id){
                        throw 'member id cannot be null in column fetches form'
                    }
                    const response = formResponse.response as FormResponse
                    group_responses[formResponse.member_id] = {
                        ...group_responses[formResponse.member_id],
                        [group_id]: response?.[field_id] ?? ''
                    }
                }
            }
            groups.push({
                type: 'pure',
                id: group_id,
                label: group.name,
                data_type: dataType ?? 'STRING',
                field_type: fieldType ?? 'SHORTANS',
            })
        }
        groups.sort((g1, g2) => (column_fetches?.[g1.id ?? ''].order ?? 0) -  (column_fetches?.[g2.id ?? ''].order ?? 0))
        return NextResponse.json({ message: "SUCCESS", data: { groups, group_responses }}, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}

function filteredColumnFetches(column_fetches: ColumnFetches, table_view: TableView | null): ColumnFetches{
    return Object.fromEntries(Object.entries(column_fetches ?? {}).filter(([_, group]) => {
        return !table_view || group.view_table.includes(table_view)
    }))
}

async function getAllRequiredForms(column_fetches: ColumnFetches){
    const formIds = Object.values(column_fetches ?? {}).map((group) => Object.keys(group.forms)).flat()
    const forms = await prisma.eventForm.findMany({
        where: {
            OR: uniqueFormIdsWhereInput(formIds)
        },
        select: {
            id: true,
            form_fields: true,
            responses_list: {
                select: {
                    member_id: true,
                    response: true,
                }
            }
        }
    })
    return Object.fromEntries(forms.map((form) => [form.id, form]))
}

const uniqueFormIdsWhereInput = (formIds: string[]) => {
    const ids = [] as { id: string }[]
    (new Set(formIds)).forEach((id) => ids.push({ id }))
    return ids
}