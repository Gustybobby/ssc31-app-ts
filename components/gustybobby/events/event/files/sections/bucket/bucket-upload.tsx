"use client"

import UploadFile from "@/components/tools/file"
import type { Dispatch, SetStateAction } from "react"

export default function BucketUpload({ eventId, setRefetch }: { eventId: string, setRefetch: Dispatch<SetStateAction<boolean>>}){
    return (
        <div className="w-full md:w-1/2">
            <UploadFile
                id="upload_new_event_file"
                label="Upload New File"
                api={{
                    url: `/api/gustybobby/events/${eventId}/files`,
                    method: 'POST',
                }}
                preview={true}
                onSuccess={() => setRefetch(refetch => !refetch)}
                size="lg"
            />
        </div>
    )
}