"use client"

import UploadFile from "@/components/tools/file"
import type { Refetch } from "./bucket-types"

export default function BucketUpload({ eventId, refetch }: { eventId: string, refetch: Refetch }){
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
                onSuccess={() => refetch({})}
                size="lg"
            />
        </div>
    )
}