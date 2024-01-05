"use client"

import { SelectOptions } from "@/components/tools/input";
import type { ContentFieldComponentProps } from "../content-fields-types";

export default function MultiSelectField({ contentConfig, eventConfig, defaultInteract, editor }: ContentFieldComponentProps){
    if(!eventConfig){
        throw 'eventConfig is undefined'
    }
    if(!editor){
        contentConfig.validate()
    }
    return(
        <SelectOptions
            id={contentConfig.getFieldId()}
            options={contentConfig.getOptionsByDataType(eventConfig, true)}
            label={contentConfig.getLabel(editor)}
            multiple={true}
            required={contentConfig.required}
            size="lg"
            defaultChecked={contentConfig.default_value}
            defaultInteract={defaultInteract}
        />
    )
}