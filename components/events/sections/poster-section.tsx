import Image from "next/image";

export default function PosterSection({ poster, width, height } : { poster?: string | null, width: number, height: number }){
    return(
        <div className="flex items-center justify-center">
            <Image
                src={poster ?? '/static/ssc31logo.png'}
                alt="event poster" 
                width={width} 
                height={height} 
                className="m-4 border border-black dark:border-white shadow-lg" 
                placeholder="blur" 
                blurDataURL="/static/ssc31logo.png"
            />
        </div>
    )
}