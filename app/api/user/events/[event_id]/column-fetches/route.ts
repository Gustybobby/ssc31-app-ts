import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/prisma-client";
import type { ColumnFetches, TableView } from "@/server/typeconfig/event";
import type { MemberReferencedResponses } from "@/server/typeconfig/table";
import type { FormResponse, PrismaFieldConfig } from "@/server/typeconfig/form";
import type { ColumnProperty } from "@/server/classes/table";
import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils";
import { filteredColumnFetches, getAllRequiredForms } from "@/server/modules/column-fetches-modules";
import { compoundAccessEvaluation } from "@/server/utils";

export async function GET(req: NextRequest, { params }: { params: { event_id: string }}){
    try{
        const session = await getServerAuthSession()
        if(!session?.user.id){
            throw 'invalid session'
        }
        const { position_id, role_id } = await prisma.eventMember.findUniqueOrThrow({
            where: {
                user_id_event_id: {
                    user_id: session.user.id,
                    event_id: params.event_id,
                },
                status: 'ACTIVE',
            },
            select: {
                position_id: true,
                role_id: true,
            }
        })
        const searchParams = req.nextUrl.searchParams
        const table_view = searchParams.get('table_view')
        const appt_id = searchParams.get('appt_id')
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
        const forms = await getAllRequiredForms(prisma, column_fetches, false, appt_id? { type: 'appt', appt_id }: { type: 'all' })
        for(const [group_id, group] of Object.entries(column_fetches ?? {})){
            let dataType = null
            let fieldType = null
            let hasValidField = false
            for(const [form_id, field_id] of Object.entries(group.forms)){
                const form = forms[form_id]
                const { global_position_access, global_role_access } = form
                const formFields = form.form_fields as { [key: string]: PrismaFieldConfig }
                const { data_type: newDataType, field_type: newFieldType, position_access, role_access } = formFields[field_id]
                if(!userHasFieldAccess({ global_position_access, global_role_access, position_access, role_access, position_id, role_id })){
                    continue
                }
                if((dataType || fieldType) && (newDataType !== dataType || newFieldType !== fieldType)){
                    throw `group ${group_id} has inconsistent data type and field type`
                }
                dataType = newDataType
                fieldType = newFieldType
                hasValidField = true
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
            if(!hasValidField){
                continue
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

function userHasFieldAccess({ global_position_access, global_role_access, position_access, role_access, position_id, role_id }: {
    global_position_access: { id: string }[]
    global_role_access: { id: string }[]
    position_access: string[]
    role_access: string[]
    position_id: string | null
    role_id: string | null
}) {
    const hasGlobalAccess = compoundAccessEvaluation({
        role_access: global_role_access.map(({ id }) => id),
        position_access: global_position_access.map(({ id }) => id),
        role_id,
        position_id,
    })
    if(hasGlobalAccess){
        return true
    }
    return compoundAccessEvaluation({ role_access, position_access, role_id, position_id })
}