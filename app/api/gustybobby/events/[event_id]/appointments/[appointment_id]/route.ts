import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma-client";
import { searchParamsToSelect } from "@/server/utils";

export async function GET(req: NextRequest, { params }: { params: { event_id: string, appointment_id: string }}){
    try{
        const searchParams = req.nextUrl.searchParams
        const select = searchParamsToSelect(searchParams)
        const data = await prisma.eventAppointment.findUniqueOrThrow({
            where: {
                id: params.appointment_id
            },
            select: select? {
                ...select,
                public: select.public || select.party_members,
                party_members: select.party_members? membersSelect(params.appointment_id): false,
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
                ...membersSelect(params.appointment_id),
            })
            return NextResponse.json({ message: "SUCCESS", data: { ...data, party_members: members } }, { status: 200 })
        }
        return NextResponse.json({ message: "SUCCESS", data }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}

const membersSelect = (appt_id: string) => ({
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
                appointment_id: appt_id
            }
        }
    }
})

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