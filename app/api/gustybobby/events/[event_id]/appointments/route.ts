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
        return NextResponse.json({ message: "SUCCESS", data }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR " }, { status: 500 })
    }
}

export async function POST(req: NextRequest,{ params }:{ params: { event_id: string }}){
    try{
        const apptRequest = await req.json()
        const { id, member_selects, ...apptData } = await apptRequest.data
        const newAppt = await prisma.eventAppointment.create({
            data: {
                ...apptData,
                party_members: {
                    connect: apptData.public? [] : Object.entries(member_selects).filter(([id, bool]) => bool)
                        .map(([id, bool]) => ({ id }))
                },
                event_id: params.event_id
            }
        })
        console.log("Created new appointment", newAppt)
        return NextResponse.json({ message: "SUCCESS" }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}