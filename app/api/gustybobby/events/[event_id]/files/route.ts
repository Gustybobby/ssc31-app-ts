import prisma from "@/prisma-client"
import { searchParamsToSelect } from "@/server/utils"
import { type NextRequest, NextResponse } from "next/server"
import { mimeTypeMap } from "@/server/typeconfig/file"
import { File } from "buffer"
import { backendClient } from "@/app/api/edgestore/[...edgestore]/_utils"

export async function GET(req: NextRequest, { params }: { params: { event_id: string }}){
    try{
        const searchParams = req.nextUrl.searchParams
        const { image, ...select } = searchParamsToSelect(searchParams) ?? {}
        const data = await prisma.eventFile.findMany({
            where: {
                event_id: params.event_id,
                mime_type: image? { in: ['image_jpeg', 'image_png'] } : undefined,
            },
            select: Object.keys(select).length? select : undefined,
            orderBy: {
                created_at: 'desc'
            }
        })
        return NextResponse.json({ message: "SUCCESS", data }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}

export async function POST(req: NextRequest, { params }: { params: { event_id: string }}){
    try{
        const data = await req.formData()
        console.log('Recieved request data', data)
        const file = data.get('file')
        const label = data.get('label')
        if(!file || !(file instanceof File)){
            throw 'not a file'
        }
        if(!(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf')){
            throw 'invalid file type'
        }
        const res = await backendClient.eventFilePublic.upload({
            content: {
                blob: new Blob([file], { type: file.type }),
                extension: mimeTypeMap[file.type].ext,
            },
            input: { event_id: params.event_id },
            ctx: {},
        })
        const id = res.url.split('/').at(-1)?.split('.')[0]
        if(!id){
            throw 'invalid id'
        }
        const newFile = await prisma.eventFile.create({
            data: {
                id,
                url: res.url,
                label: String(label),
                public: true,
                mime_type: mimeTypeMap[file.type].enum,
                event_id: params.event_id
            }
        })
        console.log('Uploaded New File', newFile, res)
        return NextResponse.json({ message: "SUCCESS", data: newFile }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}