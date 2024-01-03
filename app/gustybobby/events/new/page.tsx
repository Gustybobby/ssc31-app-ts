import MainWrapper from "@/components/globalui/main-wrapper";
import NewEvent from "@/components/gustybobby/events/new/new-event";

export default function NewEventPage(){
    return(
        <MainWrapper>
            <div className="w-full flex flex-col items-center">
                <NewEvent/>
            </div>
        </MainWrapper>
    )
}