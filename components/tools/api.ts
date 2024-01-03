'use client'

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

export async function sendDataToAPI({
    apiUrl,
    method,
    body = null,
    router = null, 
    path = '/status?status=success&id=200',
    error_path = '/status?status=error&id=400'
}: {
    apiUrl: string,
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    body?: string | null,
    router?: AppRouterInstance | null,
    path?: string,
    error_path?: string,
}){
    try{
        const res = await fetch(apiUrl, {
            method: method,
            body: body,
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (!res.ok){
            if(router){
                router.push(error_path)
            }
        }
        else if(router){
            router.push(path)
        }
        return (await res.json())
    }catch{
        if(router){
            router.push(error_path)
        }
    }
}

export async function sendFileToAPI({ apiUrl, method, body }: { apiUrl: string, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE', body: FormData }){
    try{
        const res = await fetch(apiUrl, {
            method: method,
            body: body,
        })
        return (await res.json())
    }catch{
        return "POST FILE FAILED"
    }
}