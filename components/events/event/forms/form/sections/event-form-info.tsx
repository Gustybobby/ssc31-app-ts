"use client"

import { eventStyles } from "@/components/styles/events";
import { BasicSyntaxedContentDisplay } from "@/components/tools/paragraph";
import type { FormConfigProperty } from "@/server/classes/forms/formconfig";

export default function EventFormInfo({ submitted, formConfig }: { submitted: boolean, formConfig: FormConfigProperty }){
    return(
        <div className="w-full">
            <h1 className={eventStyles.title({ extensions: 'p-8' })}>{formConfig.title}</h1>
            <BasicSyntaxedContentDisplay
                className="flex flex-col justify-start p-4 rounded-2xl space-y-2 bg-gray-200 dark:bg-transparent"
                textString={(submitted? formConfig.submitted_area: formConfig.description) ?? ''}
            />
        </div>
    )
}