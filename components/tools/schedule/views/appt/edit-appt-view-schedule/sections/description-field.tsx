import { descriptionTextAreaStyle, formatText } from "@/components/tools/paragraph";
import { dispatchApptConfig } from "../edit-appt-view-schedule";
import { inputStyles } from "@/components/styles/tools";

interface DescriptionFieldProps extends dispatchApptConfig{
    description: string
}

export default function DescriptionField({ description, dispatchApptConfig }: DescriptionFieldProps){
    return(
        <div className="w-full mt-2">
            <h1 className={inputStyles.label('default', 'lg')}>Description</h1>
            <textarea
                className={descriptionTextAreaStyle}
                placeholder="Event Descriptions" 
                value={description}
                onChange={(e) => dispatchApptConfig({
                    type: 'edit_string',
                    key: 'description',
                    value: formatText(e.target.value, description)
                })}
            />
        </div>
    )
}