import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils";
import formAuth from "@/server/modules/form-auth";
import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/prisma-client";
import FormPagination from "@/server/classes/forms/formpagination";
import createNewEventMember from "@/server/modules/creant-new-member";

export async function POST(req: NextRequest, { params }: { params: { event_id: string, form_id: string }}){
    try{
        const session = await getServerAuthSession()
        if(!session?.user.id || !session?.user.email){
            throw { message: "UNAUTHENTICATED", status: 401 }
        }
        const form = await formAuth(prisma, false, {
            user_id: session.user.id,
            user_email: session.user.email,
            event_id: params.event_id,
            form_id: params.form_id,
        })
        switch(form.message){
            case "INVALID":
            case "UNAUTHORIZED":
                throw { message: form.message, status: 403 }
            case "MEMBER_EXISTED":
            case "RESPONSE_EXISTED":
                throw { message: form.message, status: 400 }    
        }
        const request = await req.json()
        const userResponses: { [key: string ]: string } = FormPagination.initialize({
            field_order: form.form_config.field_order ?? [],
            form_fields: form.form_config.form_fields ?? {},
            eventConfig: form.event_config,
        }).getCleanFormResponses(request.data)
        try{
            form.form_config.validateFormResponse(userResponses, form.event_config)
        } catch(e){
            throw { message: e, status: 400 }
        }
        let member_id = form.member_info?.id ?? null
        switch(form.form_config.type){
            case 'JOIN':
                const newMember = await createNewEventMember(prisma, {
                    user_id: session.user.id,
                    event_id: params.event_id,
                })
                console.log('Created new event member', newMember)
                member_id = newMember.id
                break
            case 'EVALUATE':
                member_id = null
                break
        }
        const newResponses = await prisma.eventFormResponse.create({
            data: {
                response: cleanEmptyResponses(userResponses),
                snapshot: cleanEmptyResponses(userResponses),
                form_id: params.form_id,
                member_id,
                user_id: session.user.id,
            }
        })
        console.log('User',session.user.email,'submitted new responses', newResponses)
        return NextResponse.json({ message: "SUCCESS" }, { status: 200 })
    } catch(e: any){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: e.status })
    }
}

function cleanEmptyResponses(responses: { [key: string]: string }){
    return Object.fromEntries(Object.entries(responses).filter(([_, response]) => response !== ''))
}