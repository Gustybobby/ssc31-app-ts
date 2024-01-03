import prisma from "@/prisma-client"
import { backendClient } from "@/app/api/edgestore/[...edgestore]/route"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(req: NextRequest, { params }: { params: { event_id: string, file_id: string }}){
    try{
        const { url } = await prisma.eventFile.findUniqueOrThrow({
            where: {
                id: params.file_id
            },
            select:{
                url: true
            }
        })
        const res = await backendClient.eventFilePublic.deleteFile({ url })
        await prisma.eventFile.delete({
            where: {
                id: params.file_id
            }
        })
        console.log('Deleted file',params.file_id, res)
        return NextResponse.json({ message: "SUCCESS" }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}