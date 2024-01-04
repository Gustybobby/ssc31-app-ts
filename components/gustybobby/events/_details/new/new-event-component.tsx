"use client"

import { sectionStyles } from "@/components/styles/sections"
import CreateBar from "../sections/create-bar"
import type { EventDetailsHookProps } from "../hooks/event-details-reducer"
import TitleInputField from "../sections/title-input-field"
import DescriptionPreview from "../sections/description-preview"
import DescriptionEditor from "../sections/description-editor"
import PositionFields from "../sections/position-role-fields/position-fields"
import RoleFields from "../sections/position-role-fields/role-fields"

export default function NewEventComponent({ eventDetails, dispatchEventDetails }: EventDetailsHookProps){
    return(
        <div className="w-full h-fit border-1 dark:bg-black/70 flex flex-col shadow-lg">
            <CreateBar eventDetails={eventDetails}/>
            <div className={sectionStyles.container()}>
                <TitleInputField
                    eventTitle={eventDetails.title}
                    dispatchEventDetails={dispatchEventDetails}
                />
                <DescriptionPreview description={eventDetails.description}/>
                <DescriptionEditor
                    description={eventDetails.description}
                    dispatchEventDetails={dispatchEventDetails}
                />
                <PositionFields
                    positions={eventDetails.positions}
                    dispatchEventDetails={dispatchEventDetails}
                />
                <RoleFields
                    roles={eventDetails.roles}
                    dispatchEventDetails={dispatchEventDetails}
                />
            </div>
        </div>
    )
}