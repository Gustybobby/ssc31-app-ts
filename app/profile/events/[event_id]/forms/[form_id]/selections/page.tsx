import MainWrapper from "@/components/globalui/main-wrapper";
import MemberSelections from "@/components/profile/events/event/forms/selections/member-selections";

export default async function MemberJoinFormMembersSelectionsPage({ params }: { params: { event_id: string, form_id: string }}){
    return (
        <MainWrapper>
            <MemberSelections event_id={params.event_id} form_id={params.form_id}/>
        </MainWrapper>
    )
}