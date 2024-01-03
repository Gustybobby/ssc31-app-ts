import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';
import { createContext, edgeStoreRouter } from './_utils';

const handler = createEdgeStoreNextHandler({
    router: edgeStoreRouter,
    createContext,
})
export { handler as GET, handler as POST }