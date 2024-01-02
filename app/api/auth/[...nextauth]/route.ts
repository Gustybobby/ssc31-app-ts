import prisma from "@/prisma-client";
import { AuthOptions } from "next-auth";
import NextAuth, { getServerSession } from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
        })
    ],
    callbacks: {
        async signIn({ profile }){
            const user = await prisma.user.findUnique({
                where:{
                    email: profile?.email ?? ''
                },
                select:{
                    id: true
                }
            })
            if(!profile?.email){
                return false
            }
            if(!user){
                await prisma.user.create({
                    data:{
                        email: profile.email
                    }
                })
                console.log("Added",profile.email,"to database")
            }
            console.log(profile.email,"signed in")
            return true
        },
        async jwt({ token }){
            const user = await prisma.user.findUnique({
                where:{
                    email: token.email ?? ''
                },
                select:{
                    id: true,
                    role: true,
                }
            })
            return { ...token, id: user?.id, role: user?.role }
        },
        async session({ session, token }){
            session.user.id = token.id
            session.user.role = token.role
            return session
        }
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST };

export const getServerAuthSession = () => getServerSession(authOptions)