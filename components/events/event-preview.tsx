"use client";
import { Fragment, useState } from 'react';
import { useRouter } from 'next/navigation'
import LoadingSVG from '../svg/loading-svg';
import { eventStyles } from '../styles/events';
import { ZoomIn } from '../tools/transition';
import PosterSection from './sections/poster-section';

export default function EventPreview({ id, title, poster }: { id: string, title: string, poster: string | null }){
    
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    return (
        <ZoomIn show={true} duration={"duration-75"} as={Fragment}>
            <div className={eventStyles.box({ size: 'sm', round: true })}>
                <h1 className="text-black dark:text-yellow-400 text-center text-3xl font-bold pt-8">{title}</h1>
                <PosterSection
                    poster={poster}
                    width={384}
                    height={384}
                />
                <div className="w-full justify-between items-center flex">
                    <div></div>
                    <button 
                        className={eventStyles.link({ color: 'blue' })} 
                        onClick={() => {
                            setLoading(true)
                            router.push(`/events/${id}`)
                        }}
                    >
                        { loading && <LoadingSVG fillColor={'fill-blue-600'}/>}
                        See More
                    </button>
                </div>
            </div>
        </ZoomIn>
    )
}