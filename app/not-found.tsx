import Link from "next/link";
import Image from "next/image";
import MainWrapper from "@/components/globalui/main-wrapper";

export default function NotFound404(){
    return(
        <MainWrapper extraClass={"justify-center space-y-2"}>
            <h1 className="text-2xl font-bold text-center pb-4">Page Not Found</h1>
            <Image src="/static/mixxycrying.gif" width={160} height={160} alt="Error 404"/>
            <Link href={'/'} className="transition ease-in-out delay-50 bg-blue-400 hover:-translate-y-1 w-fit 
                    hover:scale-105 hover:bg-blue-500 duration-50 rounded-full flex items-center space-x-2 m-4 p-4 
                    text-center text-black font-bold text-lg">
                Back to Home
            </Link>
        </MainWrapper>
    )
}