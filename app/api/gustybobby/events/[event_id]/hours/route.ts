import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/prisma-client";

export async function GET(req: NextRequest, { params }: { params: { event_id: string } }){
    try{
        const searchParams = req.nextUrl.searchParams
        const start_at = getDateFromISOString(searchParams.get('start_at'))
        const end_at = getDateFromISOString(searchParams.get('end_at'))
        const member_id = searchParams.get('member_id')
        const position_id = searchParams.get('position_id')
        const role_id = searchParams.get('role_id')
        const appointments = await prisma.eventAppointment.findMany({
            where: {
                event_id: params.event_id,
                start_at: {
                    gte: start_at
                },
                end_at: {
                    lte: end_at
                },
                OR: [{
                        party_members: {
                            some: {
                                id: member_id ?? undefined,
                                position_id: position_id ?? undefined,
                                role_id: role_id ?? undefined,
                            }
                        }
                    }, {
                        public: true,
                        event: {
                            members: {
                                some: {
                                    id: member_id ?? undefined,
                                    position_id: position_id ?? undefined,
                                    role_id: role_id ?? undefined,
                                }
                            }
                        }
                }]
            },
            orderBy: {
                start_at: 'asc'
            },
            select: {
                id: true,
                title: true,
                type: true,
                public: true,
                start_at: true,
                end_at: true,
                _count: {
                    select: {
                        party_members: true,
                    }
                },
            }
        })
        return NextResponse.json({ message: "SUCCESS", data: appointments }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 400 })
    }
}

function getDateFromISOString(isoString: string | null){
    if(!isoString){
        throw `INVALID_ISO`
    }
    const date = new Date(decodeURI(isoString))
    if(date instanceof Date && isFinite(+date)){
        return date
    }
    throw `INVALID_ISO`
}