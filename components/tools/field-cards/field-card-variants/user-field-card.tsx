"use client"

import type { ContentConfigProperty } from "@/server/classes/forms/contentconfig"
import ContentField from "../sections/field-content/user-content-fields-map"
import type { EventConfigProperty } from "@/server/classes/eventconfig"
import { Card } from "../../card"
import { memo } from "react"

interface UserFieldCardProps {
    contentConfig: ContentConfigProperty
    eventConfig: EventConfigProperty
    defaultInteract: boolean
}

function UserFieldCardComponent({ contentConfig, eventConfig, defaultInteract }: UserFieldCardProps){
    return(
        <Card variant="translucent" extraClass="p-2">
            <div className="flex justify-between">
                <div className="w-full md:w-2/3">
                    <ContentField
                        contentConfig={contentConfig}
                        eventConfig={eventConfig}
                        defaultInteract={defaultInteract}
                        editor={false}
                    />
                </div>
                {contentConfig.required && <div className="text-red-600 dark:text-red-400 text-2xl font-bold pr-1">*</div>}
            </div>
        </Card>
    )
}

const UserFieldCard = memo(UserFieldCardComponent)
export default UserFieldCard