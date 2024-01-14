import { backendClient } from "@/app/api/edgestore/[...edgestore]/_utils"
import prisma from "@/prisma-client"
import { searchParamsToSelect } from "@/server/utils"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params } : { params: { event_id: string }}){
    try{
        const searchParams = req.nextUrl.searchParams
        const select = searchParamsToSelect(searchParams)
        const modSelect = select? Object.fromEntries(Object.keys(select).map((key) => {
            if(key === 'positions' || key === 'roles'){
                return [key, {
                    orderBy: {
                        order: 'asc'
                    }
                }]
            } else{
                return [key, true]
            }
        })) : undefined
        const data = await prisma.event.findUniqueOrThrow({
            where:{
                id: params.event_id
            },
            select: modSelect
        })
        return NextResponse.json({ data, message: "SUCCESS" }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { event_id: string }}){
    try{
        const eventRequest = await req.json()
        console.log("Recieved request", eventRequest)
        const data = eventRequest.data
        const patchedEvent = await prisma.event.update({
            where:{
                id: params.event_id
            },
            data,
        })
        console.log("Updated event", patchedEvent)
        return NextResponse.json({ message: "SUCCESS" }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { event_id: string }}){
    try{
        const files = await prisma.eventFile.findMany({
            where: {
                event_id: params.event_id
            },
            select: {
                url: true
            }
        })
        for(const { url } of files){
            const deleteRes = await backendClient.eventFilePublic.deleteFile({ url })
            console.log(deleteRes)
        }
        await prisma.eventFile.deleteMany({
            where: {
                event_id: params.event_id
            },
        })
        await prisma.event.delete({
            where:{
                id: params.event_id
            }
        })
        console.log("Deleted Event", params.event_id)
        return NextResponse.json({ message: "SUCCESS" }, { status: 200 })
    }catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}