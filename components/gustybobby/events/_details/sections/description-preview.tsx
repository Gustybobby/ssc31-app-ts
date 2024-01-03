"use client"

import { sectionStyles } from "@/components/styles/sections"
import { BasicSyntaxedContentDisplay } from "@/components/tools/paragraph"

export default function DescriptionPreview({ description }: { description: string }){
    return(
        <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
            <h1 className={sectionStyles.title({ color: 'blue', extensions: 'mb-2' })}>
                Preview
            </h1>
            <BasicSyntaxedContentDisplay
                className="flex flex-col justify-start bg-gray-200 dark:bg-black/70 p-6 rounded-2xl space-y-2"
                textString={description}
            />
        </div>
    )
}