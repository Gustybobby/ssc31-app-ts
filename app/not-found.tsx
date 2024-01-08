import Link from "next/link";
import Image from "next/image";
import MainWrapper from "@/components/globalui/main-wrapper";
import { handlerStyles } from "@/components/styles/handler";

export default function NotFound404(){
    return(
        <MainWrapper extraClass="justify-center space-y-2">
            <h1 className="text-2xl font-bold text-center">Page Not Found</h1>
            <Image src="/static/mixxycrying.gif" width={160} height={160} alt="Error 404"/>
            <Link href="/" className={handlerStyles.link}>
                Back to Home
            </Link>
        </MainWrapper>
    )
}