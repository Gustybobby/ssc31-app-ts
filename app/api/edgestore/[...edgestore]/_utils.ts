import { initEdgeStoreClient } from "@edgestore/server/core";
import { getServerAuthSession } from "../../auth/[...nextauth]/_utils";
import { initEdgeStore } from "@edgestore/server";
import { z } from "zod";

interface Context {
    [key: string]: string | null
}

export async function createContext(): Promise<Context>{
    const session = await getServerAuthSession()
    return {
        id: session?.user.id ?? null,
        email: session?.user.email ?? null,
        role: session?.user.role ?? null
    }
}

const es = initEdgeStore.context<Context>().create()

export const edgeStoreRouter = es.router({
    eventFilePublic: es.fileBucket({
            maxSize: 1024 * 1024 * 25, // 25MB
            accept: ['image/jpeg', 'image/png', 'application/pdf'],
        })
        .input(
            z.object({
                event_id: z.string(),
            }),
        )
        .path(({ input }) => [{ event_id: input.event_id }])
        .beforeUpload(({ ctx, fileInfo }) => {
            console.log('Uploading',fileInfo)
            return ctx.role === 'ADMIN'
        })
        .beforeDelete(({ ctx, fileInfo }) => {
            console.log('Deleting',fileInfo)
            return ctx.role === 'ADMIN'
        })
})

export const backendClient = initEdgeStoreClient({
    router: edgeStoreRouter,
})