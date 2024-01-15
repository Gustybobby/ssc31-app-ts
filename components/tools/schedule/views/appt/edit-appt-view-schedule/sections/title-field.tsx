import { InputField } from "@/components/tools/input";
import { contentPatterns } from "@/server/classes/forms/contentconfig";
import type { dispatchApptConfig } from "../edit-appt-view-schedule";

interface TitleFieldProps extends dispatchApptConfig {
    title: string
}

export default function TitleField({ title, dispatchApptConfig }: TitleFieldProps){
    return(
        <div className="w-full mt-2">
            <InputField
                id="appt_title_input_field"
                type="text"
                placeholder="Appointment Title"
                defaultValue={title}
                pattern={contentPatterns.label}
                size="lg"
                required={false}
                autoComplete="off"
                onChange={(e) => dispatchApptConfig({ type: 'edit_string', key: 'title', value: e.target.value })}
            />
        </div>
    )
}