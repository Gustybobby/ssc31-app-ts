import { withAuth } from "next-auth/middleware"
import { NextResponse, URLPattern } from "next/server"

const PATTERNS: URLPattern[] = [
    new URLPattern({ pathname: '/api/gustybobby/events/:event_id/:path*' }),
    new URLPattern({ pathname: '/api/user/events/:event_id/:path*' }),
]

const getParams = (url: string) => {
    const input = url.split('?')[0]
    for (const pattern of PATTERNS) {
        const patternResult = pattern.exec(input)
        if (patternResult !== null && 'pathname' in patternResult) {
            return patternResult.pathname.groups
        }
    }
    return {}
}

export default withAuth(
    async function middleware(req){
        const pathname = req.nextUrl.pathname
        const params = getParams(req.url)
        if(pathname.startsWith('/gustybobby') && req.nextauth.token?.role !== "ADMIN"){
            return NextResponse.rewrite(new URL(`/not-found`, req.url))
        }
        if(pathname.startsWith('/profile')){
            switch(req.nextauth.token?.role){
                case "ADMIN":
                    return NextResponse.redirect(`${req.nextUrl.origin}/gustybobby`)
            }
        }
        if(pathname.startsWith('/api/gustybobby') && req.nextauth.token?.role !== "ADMIN"){
            return NextResponse.redirect(`${req.nextUrl.origin}/api/middleware/unauthorized`)
        }
        if(params.event_id){
            const res = await fetch(`${req.nextUrl.origin}/api/middleware/events/${params.event_id}`)
            const { data } = await res.json()
            if(!data){
                if(pathname.startsWith(`/api/`)){
                    return NextResponse.redirect(`${req.nextUrl.origin}/api/middleware/events/${params.event_id}/not-found`)
                }
            }
        }
    }
)

export const config = {
    matcher: [
        "/api/gustybobby/:path*",
        "/api/user/:path*",
        "/events/:event_id/:path*",
        "/profile",
    ]
}