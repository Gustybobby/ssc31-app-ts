import { searchParamsToSelect } from "@/server/utils"
import { NextResponse, type NextRequest } from "next/server"
import prisma from "@/prisma-client"
import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils"

export async function GET(req: NextRequest, { params }: { params: { event_id: string, appointment_id: string }}){
    try{
        const session = await getServerAuthSession()
        if(!session?.user.id){
            throw 'invalid session'
        }
        const { position, role, status } = await prisma.eventMember.findUniqueOrThrow({
            where: {
                user_id_event_id: {
                    user_id: session.user.id,
                    event_id: params.event_id
                },
            },
            select: {
                position: {
                    select: {
                        can_regist: true
                    }
                },
                role: {
                    select: {
                        can_appoint: true
                    }
                },
                status: true,
            }
        })
        const can_regist = !!position?.can_regist || !!role?.can_appoint
        const searchParams = req.nextUrl.searchParams
        const select = searchParamsToSelect(searchParams)
        const data = await prisma.eventAppointment.findUniqueOrThrow({
            where: {
                id: params.appointment_id,
                party_members: can_regist? undefined : {
                    some: {
                        user_id: session.user.id,
                        event_id: params.event_id,
                    }
                }
            },
            select: select? {
                ...select,
                public: select.party_members || select.public,
                party_members: select.party_members? membersSelect(params.appointment_id, can_regist && status === 'ACTIVE'): false,
            }: undefined,
        })
        if(select?.party_members && data.public){
            const members = await prisma.eventMember.findMany({
                where: {
                    event_id: params.event_id,
                    status: {
                        not: 'REJECTED',
                    },
                },
                ...membersSelect(params.appointment_id, can_regist && status === 'ACTIVE'),
            })
            return NextResponse.json({ message: "SUCCESS", data: { ...data, party_members: members } }, { status: 200 })
        }
        return NextResponse.json({ message: "SUCCESS", data }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}

const membersSelect = (appt_id: string, registable: boolean) => ({
    select: {
        id: true,
        status: true,
        position: {
            select: {
                id: true,
                label: true,
            }
        },
        role: {
            select: {
                id: true,
                label: true,
            }
        },
        attendances: registable? {
            where: {
                appointment_id: appt_id
            }
        }: false
    }
})