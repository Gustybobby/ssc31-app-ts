'use client'

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { useEffect, useRef, useState } from "react"

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

export function useFetchData<T>({ apiUrl, defaultState, waitingState, badState, fetchOnInit = true, autoFetch, accessor }: {
    apiUrl: string
    defaultState: T
    waitingState?: T
    badState: T
    fetchOnInit?: boolean
    autoFetch: boolean
    accessor?: string
}){
    const [data, setData] = useState<T>(defaultState)
    const [shouldRefetch, refetch] = useState({})
    const refetchRef = useRef(fetchOnInit? {} : shouldRefetch)

    useEffect(() => {
        if(refetchRef.current === shouldRefetch && !autoFetch){
            return
        }
        refetchRef.current = shouldRefetch
        if(waitingState){
            setData(waitingState)
        }
        fetch(apiUrl)
            .then(res => res.ok? res.json() : { message: 'ERROR' })
            .then(data => {
                if(data.message !== 'SUCCESS'){
                    return badState
                }
                if(accessor){
                    return data.data[accessor]
                }
                return data.data
            })
            .then(data => setData(data))
    }, [apiUrl, waitingState, badState, accessor, autoFetch, shouldRefetch])

    return { data, setData, refetch }
}