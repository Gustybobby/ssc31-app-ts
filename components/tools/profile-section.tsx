"use client";

import { Session } from "next-auth";
import Image from "next/image";
import FetchingSVG from "../svg/fetching-svg";

export default function ProfileSection({ session }: { session: Session | null }){
    if(session){
        return(
            <>
                <h1 className="text-left text-xl p-4 font-bold flex items-center">
                    {session?.user?.image ?
                    <Image
                        src={session.user.image}
                        width={48}
                        height={48}
                        alt={'profile_image'}
                        quality={80}
                        className="rounded-full mr-3 bg-gray-300"
                    />
                    :
                    <ImagePlaceholder nameInitial={session?.user?.name?.[0] ?? null}/>
                    }
                    {session?.user?.name}
                </h1>
                <div className="px-4 pb-4 text-blue-500 overflow-hidden text-lg">
                    <span className="text-black dark:text-yellow-400">Email:</span><br/>
                    {session?.user?.email}
                </div>
            </>
        )
    }
    return(
        <div className="flex flex-col items-center">
            <FetchingSVG/>
        </div>
    )
}

function ImagePlaceholder({ nameInitial }: { nameInitial: string | null }){
    return(
        <div className={styles.imagePlaceholder}>
            {nameInitial}
        </div>
    )
}

const styles = {
    imagePlaceholder: [
        'flex justify-center items-center',
        'w-[48px] h-[48px] mr-3 rounded-full',
        'text-2xl',
        'bg-green-300 dark:bg-green-500',
    ].join(' ')
}