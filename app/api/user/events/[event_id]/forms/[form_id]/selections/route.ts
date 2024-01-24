import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils";
import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/prisma-client";
import getPermittedFormInfo from "@/server/modules/get-permitted-form-info";

export async function GET(req: NextRequest, { params }: { params: { event_id: string, form_id: string }}){
    try{
        const session = await getServerAuthSession()
        if(!session?.user.id){
            throw "invalid session"
        }
        const formInfo = await getPermittedFormInfo(prisma, {
            user_id: session.user.id,
            event_id: params.event_id,
            form_id: params.form_id,
        }, false, {
            id: params.form_id,
            type: "JOIN",
        }, {
            member: {
                NOT: {
                    status: "ACTIVE"
                }
            }
        }, (member) => member === "ADMIN" || !!member.position?.can_regist)
        switch(formInfo.type){
            case "UNAUTHORIZED":
                throw "Unauthorized"
            case "MEMBER":
                const eventConfig = await prisma.event.findUnique({
                    where: {
                        id: params.event_id
                    },
                    select: {
                        id: true,
                        positions: {
                            where: {
                                open: true,
                            },
                            select: {
                                id: true,
                                label: true,
                            }
                        },
                    }
                })
                return NextResponse.json({ message: "SUCCESS", data: {
                    form_config: formInfo.form_config,
                    responses: formInfo.responses,
                    eventConfig,
                } }, { status: 200 })
        }
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 400 })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { event_id: string, form_id: string }}){
    try{
        const session = await getServerAuthSession()
        if(!session?.user.id){
            throw 'invalid session'
        }
        const member = await prisma.eventMember.findUniqueOrThrow({
            where: {
                user_id_event_id: {
                    user_id: session.user.id,
                    event_id: params.event_id
                },
                status: 'ACTIVE',
                position: {
                    can_regist: true,
                },
            },
            select: {
                id: true
            }
        })
        const selectionRequest = await req.json()
        const selection = selectionRequest.data as { [member_id: string]: { position_id: string }}
        console.log("Recieved Request from user", session.user.id, selectionRequest)
        for(const [member_id, memberData] of Object.entries(selection)){
            await prisma.eventMember.update({
                where: {
                    id: member_id
                },
                data: {
                    status: memberData.position_id === 'NONE'? 'PENDING' : 'SELECTED',
                    position_id: memberData.position_id === 'NONE'? null : memberData.position_id,
                }
            })
            console.log("member", member.id, "of user", session.user.id, "selected", member_id, "as position", memberData.position_id)
        }
        return NextResponse.json({ message: "SUCCESS" }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 400 })
    }   
}