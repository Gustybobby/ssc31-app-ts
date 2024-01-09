import MainWrapper from "@/components/globalui/main-wrapper";
import { getServerAuthSession } from "../api/auth/[...nextauth]/_utils";
import prisma from "@/prisma-client";
import Profile from "@/components/profile/profile";

export default async function ProfilePage(){
    const session = await getServerAuthSession()
    if(!session?.user.id || !session?.user.role){
        throw 'invalid session'
    }
    const eventMembers = await prisma.eventMember.findMany({
        where:{
            user_id: session.user.id
        },
        select:{
            status: true,
            position: {
                select: {
                    label: true
                }
            },
            role: {
                select: {
                    label: true
                }
            },
            event:{
                select:{
                    id: true,
                    title: true,
                }
            }
        }
    })
    return(
        <MainWrapper>
            <Profile session={session} event_members={eventMembers}/>
        </MainWrapper>
    )
}