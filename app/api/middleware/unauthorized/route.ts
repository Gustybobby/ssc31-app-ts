import { NextResponse } from "next/server";

export async function GET(){
    console.log('Unauthorized Gustybobby Access')
    return NextResponse.json({ message: "ERROR" }, { status: 400 })
}