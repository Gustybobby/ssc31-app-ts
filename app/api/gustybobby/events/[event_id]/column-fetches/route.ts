import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/prisma-client";
import type { ColumnFetches } from "@/server/typeconfig/event";
import type { MemberReferencedResponses } from "@/server/typeconfig/table";
import type { FormResponse } from "@/server/typeconfig/form";
import { ColumnProperty } from "@/server/classes/table";

export async function GET(req: NextRequest, { params }: { params: { event_id: string }}){
    try{
        const event = await prisma.event.findUniqueOrThrow({
            where:{
                id: params.event_id
            },
            select: {
                column_fetches: true
            }
        })
        const column_fetches = event.column_fetches as ColumnFetches
        const groups: ColumnProperty[] = []
        const group_responses: MemberReferencedResponses = {}
        for(const [group_id, group] of Object.entries(column_fetches ?? {})){
            groups.push({
                type: 'pure',
                id: group_id,
                label: group.name,
                data_type: 'STRING',
                field_type: 'SHORTANS',
            })
            for(const [form_id, field_id] of Object.entries(group.forms)){
                const formResponses = await prisma.eventFormResponse.findMany({
                    where: {
                        form_id,
                    },
                    select: {
                        member_id: true,
                        response: true,
                    }
                })
                for(const formResponse of formResponses){
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
        }
        groups.sort((g1, g2) => (column_fetches?.[g1.id ?? ''].order ?? 0) -  (column_fetches?.[g2.id ?? ''].order ?? 0))
        return NextResponse.json({ message: "SUCCESS", data: { groups, group_responses }}, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}