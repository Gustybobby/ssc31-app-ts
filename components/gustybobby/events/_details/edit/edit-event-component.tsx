"use client"

import type { EventDetailsHookProps } from "../hooks/event-details-reducer"
import type { Dispatch, SetStateAction } from "react"
import SaveBar from "../sections/save-bar"
import { sectionStyles } from "@/components/styles/sections"
import TitleInputField from "../sections/title-input-field"
import { ImageURLSelector } from "@/components/tools/file"
import DescriptionPreview from "../sections/description-preview"
import DescriptionEditor from "../sections/description-editor"
import PositionFields from "../sections/position-role-fields/position-fields"
import RoleFields from "../sections/position-role-fields/role-fields"

interface EditEventComponentProps extends EventDetailsHookProps {
    refetch: Dispatch<SetStateAction<{}>>
}

export default function EditEventComponent({ eventDetails, dispatchEventDetails, refetch }: EditEventComponentProps){
    return(
        <div>
            <SaveBar
                eventDetails={eventDetails}
                refetch={refetch}
            />
            <div className={sectionStyles.container()}>
                <TitleInputField
                    eventTitle={eventDetails.title}
                    dispatchEventDetails={dispatchEventDetails}
                />
                <div className={sectionStyles.box.gray({ round: true, shadow: true })}>
                    <h1 className={sectionStyles.title({ color: 'blue', extensions: 'mb-2' })}>Poster</h1>
                    <ImageURLSelector
                        url={`/api/gustybobby/events/${eventDetails.id}/files?image=1`}
                        fileUrl={eventDetails.poster ?? ''}
                        setFileUrl={(fileUrl) => dispatchEventDetails({ type: 'edit_single', key: 'poster', value: fileUrl })}
                    />
                </div>
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