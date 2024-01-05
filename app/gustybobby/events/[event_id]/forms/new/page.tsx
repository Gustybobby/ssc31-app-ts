import MainWrapper from "@/components/globalui/main-wrapper";
import NewForm from "@/components/gustybobby/events/event/forms/new/new-form";

export default function NewFormPage({ params }: { params: { event_id: string, form_id: string }}){
    return(
        <MainWrapper>
            <NewForm event_id={params.event_id} form_id={params.form_id}/>
        </MainWrapper>
    )
}