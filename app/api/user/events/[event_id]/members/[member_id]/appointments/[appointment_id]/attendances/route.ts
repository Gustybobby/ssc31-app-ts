import { NextResponse, type NextRequest } from "next/server"
import prisma from "@/prisma-client"
import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils"

interface AttendanceRouteParams {
    event_id: string
    member_id: string
    appointment_id: string
}

export async function PUT(req: NextRequest, { params }: { params: AttendanceRouteParams }){
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
                position_id: true,
                role_id: true,
            }
        })
        const attendanceRequest = await req.json()
        console.log('Recieved request', attendanceRequest)
        const { id, member_id, appointment_id, ...attendanceData } = attendanceRequest.data
        await prisma.eventAppointment.findUniqueOrThrow({
            where: {
                id: params.appointment_id,
                party_members: {
                    some: {
                        id: params.member_id
                    }
                }
            },
            select: {
                id: true,
            }
        })
        const upsertedAttendance = await prisma.attendance.upsert({
            where: {
                member_id_appointment_id: {
                    member_id: params.member_id,
                    appointment_id: params.appointment_id,
                }
            },
            create: {
                ...attendanceData,
                member_id: params.member_id,
                appointment_id: params.appointment_id,
            },
            update: {
                ...attendanceData,
            }
        })
        if(!upsertedAttendance.check_in && !upsertedAttendance.check_out){
            await prisma.attendance.delete({
                where: {
                    id: upsertedAttendance.id
                }
            })
            console.log("Deleted upserted attendance due to empty check-in and check-out entries by member", member)
            return NextResponse.json({ message: "SUCCESS" }, { status: 200 })
        }
        console.log("Upserted attendance", upsertedAttendance, "by member", member)
        return NextResponse.json({ message: "SUCCESS", data: upsertedAttendance }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}