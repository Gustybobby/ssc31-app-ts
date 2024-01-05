import ShortAnswerField from "./user-field-content-components/short-answer-field"
import ContentConfig from "@/server/classes/forms/contentconfig"
import type { ContentFieldProps, ContentFieldsType } from "./content-fields-types"
import ParagraphField from "./user-field-content-components/paragraph-field"
import OptionsField from "./user-field-content-components/options-field"
import MultiSelectField from "./user-field-content-components/multiselect-field"

const ContentFieldComponents: ContentFieldsType = {
    SHORTANS: (props) => <ShortAnswerField {...props}/>,
    PARAGRAPH: (props) => <ParagraphField {...props}/>,
    OPTIONS: (props) => <OptionsField {...props}/>,
    MULTISELECT: (props) => <MultiSelectField {...props}/>,
    PRIVACYPOLICY: (props) => <OptionsField {...props}/>,
    INFO: () => <></>,
    ACT_HOURS: () => <></>,
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