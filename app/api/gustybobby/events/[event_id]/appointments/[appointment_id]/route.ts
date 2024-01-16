import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma-client";

export async function PUT(req: NextRequest, { params }: { params: { appointment_id: string }}){
    try{
        const apptRequest = await req.json()
        const { id, member_selects, ...apptData } = apptRequest.data
        const updatedAppt = await prisma.eventAppointment.update({
            where: {
                id: params.appointment_id
            },
            data: {
                ...apptData,
                party_members: {
                    set: apptData.public? [] : Object.entries(member_selects).filter(([id, bool]) => bool)
                        .map(([id, bool]) => ({ id }))
                },
            }
        })
        console.log('Updated Appointment', updatedAppt)
        return NextResponse.json({ message: "SUCCESS" }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { appointment_id: string }}){
    try{
        await prisma.eventAppointment.delete({
            where: {
                id: params.appointment_id
            }
        })
        console.log('Deleted appointment', params.appointment_id)
        return NextResponse.json({ message: "SUCCESS" }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}