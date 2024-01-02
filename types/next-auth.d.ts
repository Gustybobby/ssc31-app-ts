import { Role } from "@prisma/client"
import NextAuth, { DefaultSession } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id?: string | null
            role?: Role | null
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id?: string | null
        role?: Role | null
    }
}