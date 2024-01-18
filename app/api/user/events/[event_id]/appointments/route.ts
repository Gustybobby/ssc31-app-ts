import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils";
import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/prisma-client";
import { GustybobbyAppointment } from "@/server/typeconfig/record";

export async function GET(req: NextRequest, { params }: { params: { event_id: string }}){
    try{
        const session = await getServerAuthSession()
        if(!session?.user.id || !session?.user.role){
            throw 'invalid session'
        }
        const member = await prisma.eventMember.findUniqueOrThrow({
            where: {
                user_id_event_id: {
                    event_id: params.event_id,
                    user_id: session.user.id,
                }
            },
            select: {
                appointments: {
                    include: {
                        _count: {
                            select: {
                                party_members: true
                            }
                        }
                    }
                },
                position: {
                    select: {
                        created_appointments: {
                            include: {
                                party_members: {
                                    select: {
                                        id: true,
                                        user_id: true,
                                        position: true,
                                        role: true,
                                    }
                                },
                                _count: {
                                    select: {
                                        party_members: true
                                    }
                                }
                            }
                        }
                    }
                },
                attendances: true
            }
        })
        const publicAppts = await prisma.eventAppointment.findMany({
            where: {
                event_id: params.event_id,
                public: true,
            },
            include: {
                _count: {
                    select: {
                        party_members: true
                    }
                }
            }
        })
        const apptObject: { [appt_id: string]: GustybobbyAppointment } = {}
        for(const appt of [...publicAppts, ...member.appointments]){
            const attendance = member.attendances.find((atd) => atd.appointment_id === appt.id)
            apptObject[appt.id] = {
                ...appt,
                permission: 'read_only',
                start_at: appt.start_at.toISOString(),
                end_at: appt.end_at.toISOString(),
                attendance: attendance? {
                    id: attendance.id,
                    check_in: attendance.check_in?.toISOString() ?? null,
                    check_out: attendance.check_out?.toISOString() ?? null,
                    member_id: attendance.member_id,
                } : null
            }
        }
        for(const appt of member.position?.created_appointments ?? []){
            apptObject[appt.id] = {
                ...appt,
                permission: 'editable',
                start_at: appt.start_at.toISOString(),
                end_at: appt.end_at.toISOString(),
            }
        }
        return NextResponse.json({ message: "SUCCESS", data: Object.values(apptObject) }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}