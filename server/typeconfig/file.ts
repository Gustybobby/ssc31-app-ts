import type { MimeType } from "@prisma/client"

export const mimeTypeMap: {
    [key: string]: MapContent
} = {
    'image/jpeg': {
        ext: 'jpg',
        enum: 'image_jpeg'
    },
    'image/png': {
        ext: 'png',
        enum: 'image_png',
    },
    'application/pdf': {
        ext: 'pdf',
        enum: 'application_pdf',
    },
}

interface MapContent {
    ext: string
    enum: MimeType
}