import Image from "next/image"

export default function Loading(){
    return(
        <div className="w-full h-screen flex flex-col items-center pt-60">
            <div className="flex flex-col items-center justify-center pb-2">
                <Image src="/static/mixxy.gif" width={160} height={160} alt="Loading"/>
            </div>
            <div className="text-center text-black dark:text-white text-3xl font-bold">
                Mixing
            </div>
        </div>
    )
}