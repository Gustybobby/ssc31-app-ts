import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma-client";
import { searchParamsToSelect } from "@/server/utils";

export async function GET(req: NextRequest, { params }: { params: { appointment_id: string }}){
    try{
        const searchParams = req.nextUrl.searchParams
        const select = searchParamsToSelect(searchParams)
        const data = await prisma.eventAppointment.findUnique({
            where: {
                id: params.appointment_id
            },
            select: select? {
                ...select,
                party_members: select.party_members? {
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
                        attendances: {
                            where: {
                                appointment_id: params.appointment_id
                            }
                        }
                    }
                }: false,
            }: undefined,
        })
        return NextResponse.json({ message: "SUCCESS", data }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}

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