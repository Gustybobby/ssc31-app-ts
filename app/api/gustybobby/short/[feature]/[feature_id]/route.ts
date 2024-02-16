import { generateRandomId } from "@/server/modules/generate-random-id";
import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/prisma-client";

export async function POST(req: NextRequest, { params }: { params: { feature: string, feature_id: string }}){
    try {
        switch(params.feature){
            case "form":
                const formShortIdList = await prisma.eventFormShortId.findMany()
                if(formShortIdList.find(({ form_id }) => form_id === params.feature_id)){
                    throw "FORM ALREADY HAS A SHORT ID"
                }
                let randomId: string | null = null
                let i = 0
                while(i < 10000){//break under 10000 unique id generation attempts
                    randomId = generateRandomId(5)
                    if(!formShortIdList.find(({ id }) => id === randomId)){
                        break
                    }
                    i++
                }
                if(!randomId || i >= 10000){
                    throw "UNIQUE ID GENERATION FAILED"
                }
                const newShortId = await prisma.eventFormShortId.create({
                    data: {
                        id: randomId,
                        form_id: params.feature_id,
                    }
                })
                console.log('Generated new form short id', newShortId)
                return NextResponse.json({ message: "SUCCESS", data: newShortId }, { status: 200 })
            default:
                throw "INVALID FEATURE"
        }
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR" }, { status: 500 })
    }
}