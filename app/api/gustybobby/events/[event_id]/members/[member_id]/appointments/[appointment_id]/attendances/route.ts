import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/prisma-client";

interface AttendanceRouteParams {
    event_id: string
    member_id: string
    appointment_id: string
}

export async function POST(req: NextRequest, { params }: { params: AttendanceRouteParams }){
    try{
        const attendanceRequest = await req.json()
        console.log('Recieved request', attendanceRequest)
        const { id, ...attendanceData } = attendanceRequest.data
        const newAttendance = await prisma.attendance.create({
            data: {
                ...attendanceData,
                member_id: params.member_id,
                appointment_id: params.appointment_id,
            }
        })
        console.log("Created new attendance",newAttendance)
        return NextResponse.json({ message: "SUCCESS", data: newAttendance }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: AttendanceRouteParams }){
    try{
        const attendanceRequest = await req.json()
        console.log('Recieved request', attendanceRequest)
        const { id, member_id, appointment_id, ...attendanceData } = attendanceRequest.data
        const updatedAttendance = await prisma.attendance.update({
            where: {
                member_id_appointment_id: {
                    member_id: params.member_id,
                    appointment_id: params.appointment_id,
                }
            },
            data: {
                ...attendanceData,
            }
        })
        console.log("Updated attendance",updatedAttendance)
        return NextResponse.json({ message: "SUCCESS", data: updatedAttendance }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}