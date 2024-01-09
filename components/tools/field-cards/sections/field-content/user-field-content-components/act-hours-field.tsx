"use client"

import DatePicker from "@/components/tools/date/date";
import { ContentFieldComponentProps } from "../content-fields-types";

export default function ActHoursField({ contentConfig, editor }: ContentFieldComponentProps){
    return(
        <>
            <DatePicker
                id={contentConfig.id+'_DATE'}
                label={contentConfig.getLabel(editor)}
                defaultValue={contentConfig.default_value}
            />
        </>
    )
}