import MainWrapper from "@/components/globalui/main-wrapper";
import FormEditor from "@/components/gustybobby/events/event/forms/form/editor/form-editor";

export default function FormEditorPage({ params }: { params: { event_id: string, form_id: string }}){
    return(
        <MainWrapper>
            <FormEditor event_id={params.event_id} form_id={params.form_id}/>
        </MainWrapper>
    )
}