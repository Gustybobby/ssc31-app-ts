import type { FormType } from "@prisma/client"

export interface FormCardConfig {
    id: string
    title: string
    type: FormType
    open: boolean
    _count: {
        responses_list: number
    }
    updated_at: Date
}