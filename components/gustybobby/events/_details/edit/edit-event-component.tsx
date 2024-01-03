"use client"

import type { EventDetailsHookProps } from "../hooks/event-details-reducer"
import type { Dispatch, MutableRefObject, SetStateAction } from "react"
import { EventDataRequest } from "@/server/typeconfig/event"
import SaveBar from "../sections/save-bar"
import { sectionStyles } from "@/components/styles/sections"
import TitleInputField from "../sections/title-input-field"
import { ImageURLSelector } from "@/components/tools/file"
import DescriptionPreview from "../sections/description-preview"
import DescriptionEditor from "../sections/description-editor"
import PositionFields from "../sections/positionrolefields/position-fields"
import RoleFields from "../sections/positionrolefields/role-fields"

interface EditEventComponentProps extends EventDetailsHookProps {
    setRefetch: Dispatch<SetStateAction<boolean>>
}

export default function EditEventComponent({ eventDetails, dispatchEventDetails, setRefetch }: EditEventComponentProps){
    return(
        <div>
            <SaveBar
                eventDetails={eventDetails}
                setRefetch={setRefetch}
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