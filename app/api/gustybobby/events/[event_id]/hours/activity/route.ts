import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/prisma-client";
import { type DistributionMode, calculateHoursDistribution } from "@/server/modules/hours-modules";

export async function GET(req: NextRequest, { params }: { params: { event_id: string }}){
    try{
        const searchParams = req.nextUrl.searchParams
        const start_at = getDateFromISOString(searchParams.get('start_at'))
        const end_at = getDateFromISOString(searchParams.get('end_at'))
        const member_id = searchParams.get('member_id')
        const position_id = searchParams.get('position_id')
        const role_id = searchParams.get('target_role_id')
        const mode = searchParams.get('mode') as DistributionMode
        const appointments = await prisma.eventAppointment.findMany({
            where: {
                event_id: params.event_id,
                start_at: {
                    gte: start_at
                },
                end_at: {
                    lte: end_at
                },
                party_members: {
                    some: {
                        id: member_id ?? undefined,
                        position_id: position_id ?? undefined,
                        role_id: role_id ?? undefined,
                    }
                }
            },
            select: {
                id: true,
                title: true,
                start_at: true,
                end_at: true,
                attendances: {
                    select: {
                        check_in: true,
                        check_out: true,
                        member_id: true,
                    }
                },
                party_members: {
                    where: {
                        id: member_id ?? undefined,
                        position_id: position_id ?? undefined,
                        role_id: role_id ?? undefined,
                    },
                    select: {
                        id: true
                    }
                },
            }
        })
        const distribution = calculateHoursDistribution(appointments, mode)
        return NextResponse.json({ message: "SUCCESS", data: distribution }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
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