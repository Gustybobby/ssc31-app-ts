"use client"

import FileCard from "./file-card"
import FileCardsLoading from "./file-cards-loading"
import useBucketFiles from "./hooks/use-bucket-files"

export default function BucketFiles({ eventId, shouldRefetch }: { eventId: string, shouldRefetch: {} }){

    const { files, setFiles } = useBucketFiles(eventId, shouldRefetch)
    
    if(files === 'loading'){
        return <FileCardsLoading/>
    }
    if(files === 'error'){
        throw 'fetch files error'
    }
    return(
        <div className="mb-2 flex flex-wrap gap-2">
            {files.map((file) => (
                <FileCard
                    key={file.id}
                    eventId={eventId}
                    id={file.id}
                    label={file.label ?? ''}
                    url={file.url}
                    setFiles={setFiles}
                />
            ))}
        </div>
    )
}