import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { [key: string]: string }}){
    console.log("Invalid event id", params.event_id)
    return NextResponse.json({ message: "ERROR" }, { status: 404 })
}