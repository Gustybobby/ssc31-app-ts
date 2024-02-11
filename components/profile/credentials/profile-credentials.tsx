"use client"

import type { Session } from "next-auth"

export default function ProfileCredentials({ session, date }: { session: Session, date: Date }){
    return (
        <div className="w-full md:w-fit text-white bg-black/70 p-4 rounded-lg shadow-lg flex flex-col text-left space-y-2">
            <span>Time: {date.toLocaleString()}</span>
            <span>Email: {session.user.email}</span>
            <span>Name: {session.user.name}</span>
        </div>   
    )
}

