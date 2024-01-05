import prisma from "@/prisma-client"
import { EventDataRequest } from "@/server/typeconfig/event"
import { searchParamsToSelect } from "@/server/utils"
import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

//get all events data
export async function GET(req: NextRequest){
    try{
        const searchParams = req.nextUrl.searchParams
        const select = searchParamsToSelect(searchParams)
        const data = await prisma.event.findMany({
            select,
        })
        return NextResponse.json({ data, message: "SUCCESS" },{ status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}

//create new event
export async function POST(req: NextRequest){
    try{
        const newEvent = await req.json()
        console.log("Recieved request", newEvent)
        const eventData: EventDataRequest = newEvent.data
        checkDuplicates(eventData.positions.map((position) => position.label), "positions")
        checkDuplicates(eventData.roles.map((role) => role.label), "roles")
        const event_id = await prisma.$transaction(async(tx) => {
            const event = await tx.event.create({
                data:{
                    title: eventData.title,
                    description: eventData.description,
                }
            })
            const eventPositions = await tx.eventPosition.createMany({
                data: eventData.positions.map((position,index)=>({
                    label: position.label,
                    order: index,
                    open: position.open,
                    can_regist: position.can_regist,
                    event_id: event.id,
                }))
            })
            const eventRoles = await tx.eventRole.createMany({
                data: eventData.roles.map((role,index)=>({
                    label: role.label,
                    order: index,
                    can_appoint: role.can_appoint,
                    event_id: event.id
                }))
            })
            console.log("Created New Event",event, eventPositions, eventRoles)
            return event.id
        })
        return NextResponse.json({ message: "SUCCESS", data: { id: event_id } }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 400 })
    }
}

function checkDuplicates(labelList: string[], fields_name: string){
    if(new Set(labelList).size != labelList.length){
        throw `Duplicate ${fields_name}`
    }
}