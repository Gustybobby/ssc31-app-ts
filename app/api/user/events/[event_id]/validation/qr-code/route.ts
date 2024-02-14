import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils";
import { decryptQR } from "@/server/modules/qr-encryption";
import { NextResponse, type NextRequest } from "next/server";
import { isDate } from "util/types";
import prisma from "@/prisma-client";

export async function POST(req: NextRequest, { params }: { params: { event_id: string }}){
    try {
        const session = await getServerAuthSession()
        if(!session?.user.id){
            throw 'UNAUTHENTICATED'
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
        const request = await req.json()
        console.log("Recieved Request:", request, "from", session)
        const requestData = request.data
        if (typeof requestData !== "string"){
            throw 'NOT STRING'
        }
        const decryptedString = decryptQR(requestData)
        const [user_id, iso_string] = decryptedString.split('</>')
        if(!user_id || !iso_string || !isDate(new Date(iso_string))){
            throw 'INVALID QR CODE FORMAT'
        }
        if((new Date()).getTime() - (new Date(iso_string)).getTime() > 5 * 1000 * 60){
            throw 'QR CODE EXPIRED'
        }
        return NextResponse.json({ message: "SUCCESS", data: { user_id, iso_string } }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: e }, { status: 500 })
    }
}