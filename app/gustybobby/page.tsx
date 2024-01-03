import MainWrapper from "@/components/globalui/main-wrapper";
import Gustybobby from "@/components/gustybobby/gustybobby";

export default function GustybobbyPage(){
    return(
        <MainWrapper>
            <div className="w-full flex flex-col items-center">
                <Gustybobby/>
            </div>
        </MainWrapper>
    )
}