import { useMemo } from "react"
import ContentConfig from "@/server/classes/forms/contentconfig"
import type { EditorContentFieldProps, EditorContentFieldsType } from "./content-fields-types"
import LabelField from "./editor-field-content-components/label-field"
import InfoField from "./editor-field-content-components/info-field"

const ContentFieldComponents: EditorContentFieldsType = {
    SHORTANS: (props) => <LabelField {...props}/>,
    PARAGRAPH: (props) => <LabelField {...props}/>,
    OPTIONS: (props) => <LabelField {...props}/>,
    MULTISELECT: (props) => <LabelField {...props}/>,
    PRIVACYPOLICY: () => <></>,
    INFO: (props) => <InfoField {...props}/>,
    ACT_HOURS: (props) => <LabelField {...props}/>,
    HOURS_SEMS: (props) => <LabelField {...props}/>,
}

export default function EditorContentField({ contentConfig, dispatchFormConfig }: EditorContentFieldProps){

    const contentConfigClassObject = useMemo(() => new ContentConfig(contentConfig), [contentConfig])

    return(
        <>
            {ContentFieldComponents[contentConfig.field_type]({
                contentConfig: contentConfigClassObject,
                dispatchFormConfig
            })}
        </>
    )
}