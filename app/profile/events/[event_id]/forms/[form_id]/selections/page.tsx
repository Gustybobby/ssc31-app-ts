import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/_utils";
import MainWrapper from "@/components/globalui/main-wrapper";
import MemberSelections from "@/components/profile/events/event/forms/selections/member-selections";
import { redirect } from "next/navigation";

export default async function MemberJoinFormMembersSelectionsPage({ params }: { params: { event_id: string, form_id: string }}){
    const session = await getServerAuthSession()
    if(!session){
        redirect('/profile')
    }
    return (
        <MainWrapper>
            <MemberSelections event_id={params.event_id} form_id={params.form_id}/>
        </MainWrapper>
    )
}