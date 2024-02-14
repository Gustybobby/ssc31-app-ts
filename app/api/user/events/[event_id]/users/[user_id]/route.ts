import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/prisma-client";
import { searchParamsToSelect } from "@/server/utils";
import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils";

export async function GET(req: NextRequest, { params }: { params: { event_id: string, user_id: string }}){
    try {
        const session = await getServerAuthSession()
        if(!session?.user.id){
            throw 'invalid session'
        }
        try {
            await prisma.eventMember.findUniqueOrThrow({
                where: {
                    user_id_event_id: {
                        user_id: session.user.id,
                        event_id: params.event_id
                    },
                    status: 'ACTIVE',
                    OR: [{
                            position: {
                                can_regist: true
                            }
                        }, {
                            role: {
                                can_appoint: true
                            }
                    }]
                }, select: {
                    id: true,
                }
            })
        } catch(e){
            console.log(e)
            throw 'UNAUTHORIZED'
        }
        const searchParams = req.nextUrl.searchParams
        const select = searchParamsToSelect(searchParams)
        const data = await prisma.eventMember.findUniqueOrThrow({
            where: {
                user_id_event_id: {
                    user_id: params.user_id,
                    event_id: params.event_id,
                }
            },
            select,
        })
        return NextResponse.json({ message: "SUCCESS", data }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}