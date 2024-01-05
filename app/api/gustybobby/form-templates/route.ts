import prisma from "@/prisma-client"
import FormTemplate from "@/server/classes/forms/formtemplate"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest){
    try{
        const form = await req.json()
        console.log("Recieved request", form)
        const formFieldsArray = form.data
        const template = FormTemplate.fromFormFieldsArray(formFieldsArray)
        const newFormTemplate = await prisma.eventFormTemplate.create({
            data: {...template}
        })
        console.log("Created New Form Template", newFormTemplate)
        return NextResponse.json({ message: "SUCCESS" }, { status: 200 })
    } catch(e){
        console.log(e)
        return NextResponse.json({ message: "ERROR"}, { status: 500 })
    }
}