"use client"

import MainWrapper from "@/components/globalui/main-wrapper";
import { handlerStyles } from "@/components/styles/handler";
import Image from "next/image";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }){

    useEffect(() => {
        console.error(error)
    }, [error])
    
    return(
        <MainWrapper extraClass="justify-center space-y-2">
            <h1 className="text-2xl font-bold text-center">Something went wrong {':('}</h1>
            <Image src="/static/mixxycrying.gif" width={160} height={160} alt="Server Error"/>
            <button className={handlerStyles.link} onClick={() => reset()}>
                Try again
            </button>
            <div >
                {JSON.stringify(error)}
            </div>
        </MainWrapper>
    )
}