import MainWrapper from "@/components/globalui/main-wrapper";

export default async function Home() {  
    return (
        <MainWrapper extraClass="justify-center">
            <h1 className="text-8xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-yellow-400">
                SSC31
            </h1>
            <h1 className="font-bold text-5xl text-center text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">
                Ready To Go
            </h1>
        </MainWrapper>
    )
}