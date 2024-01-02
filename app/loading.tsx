import Image from "next/image"
export default function LoadingSkeleton(){
    return(
        <div className="w-full h-screen flex flex-col items-center pt-60">
            <div className="flex flex-col items-center justify-center pb-2">
                <Image src="/static/mixxy.gif" width={160} height={160} alt="Loading"/>
            </div>
            <div className="text-center text-black dark:text-white text-xl">
            <span className="text-3xl font-bold">Mixing</span>
            </div>
        </div>
    )
}

export function LoadingChild(){
    return(
        <div className="w-full h-screen flex flex-col items-center pt-60">
            <div className="flex flex-col items-center justify-center pb-2">
                <Image src="/static/mixxy.gif" width={160} height={160} alt="Loading"/>
            </div>
            <div className="text-center text-black dark:text-white text-xl">
                <span className="text-3xl font-bold">Mixing</span>
            </div>
        </div>
    )
}