"use client"

import DatePicker from "@/components/tools/date/date-picker";
import { ContentFieldComponentProps } from "../content-fields-types";
import TimePicker from "@/components/tools/time/time-picker";

export default function ActHoursField({ contentConfig, editor }: ContentFieldComponentProps){
    return(
        <>
            <DatePicker
                id={contentConfig.id+'_DATE'}
                label={contentConfig.getLabel(editor)}
                defaultValue={contentConfig.default_value}
            />
            <TimePicker
                id={contentConfig.id+'_TIME'}
                label={''}
                defaultValue={contentConfig.default_value}
            />
        </>
    )
}