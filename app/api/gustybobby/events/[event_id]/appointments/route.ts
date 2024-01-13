import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/prisma-client";

export async function GET(req: NextRequest, { params }: { params: { event_id: string }}){
    try{
        const appointments = await prisma.eventAppointment.findMany({
            where: {
                event_id: params.event_id
            },
            include: {
                party_members: {
                    select: {
                        id: true,
                        user_id: true,
                        position: true,
                        role: true,
                    }
                },
                attendances: true,
                _count: {
                    select: {
                        party_members: true
                    }
                }
            }
        })
        const data = appointments.map((appt) => ({
            ...appt,
            permission: 'editable',
        }))
        console.log(data)
        return NextResponse.json({ message: "SUCCESS", data }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR " }, { status: 500 })
    }
}