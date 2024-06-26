import ShortAnswerField from "./user-field-content-components/short-answer-field"
import ContentConfig from "@/server/classes/forms/contentconfig"
import type { ContentFieldProps, ContentFieldsType } from "./content-fields-types"
import ParagraphField from "./user-field-content-components/paragraph-field"
import OptionsField from "./user-field-content-components/options-field"
import MultiSelectField from "./user-field-content-components/multiselect-field"
import InfoField from "./user-field-content-components/info-field"
import ActHoursField from "./user-field-content-components/act-hours-field"

const ContentFieldComponents: ContentFieldsType = {
    SHORTANS: (props) => <ShortAnswerField {...props}/>,
    PARAGRAPH: (props) => <ParagraphField {...props}/>,
    OPTIONS: (props) => <OptionsField {...props}/>,
    MULTISELECT: (props) => <MultiSelectField {...props}/>,
    PRIVACYPOLICY: (props) => <OptionsField {...props}/>,
    INFO: (props) => <InfoField {...props}/>,
    ACT_HOURS: (props) => <ActHoursField {...props}/>,
    HOURS_SEMS: () => <></>,
}

export default function ContentField({ contentConfig, eventConfig, defaultInteract, editor }: ContentFieldProps){

    const contentConfigClassObject = new ContentConfig(contentConfig)
    
    return(
        <>
            {ContentFieldComponents[contentConfig.field_type]({
                contentConfig: contentConfigClassObject,
                eventConfig,
                defaultInteract,
                editor,
            })}
        </>
    )
}