import { BasicSyntaxedContentDisplay } from "@/components/tools/paragraph";
import type { ContentFieldComponentProps } from "../content-fields-types";

export default function InfoField({ contentConfig, editor }: ContentFieldComponentProps){
    return(
        <>
            {!editor &&
            <BasicSyntaxedContentDisplay
                className="flex flex-col justify-start bg-gray-200 dark:bg-black/70 p-6 rounded-2xl space-y-2"
                textString={contentConfig.label}
            />
            }
        </>
        
    )
}