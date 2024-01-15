import { InputField } from "@/components/tools/input";
import { contentPatterns } from "@/server/classes/forms/contentconfig";
import type { dispatchApptConfig } from "../edit-appt-view-schedule";

interface LocationFieldProps extends dispatchApptConfig {
    location: string
}

export default function LocationField({ location, dispatchApptConfig }: LocationFieldProps){
    return(
        <div className="w-full mt-2">
            <InputField
                id="appt_location_input_field"
                type="text"
                size="lg"
                placeholder="Appointment Location"
                defaultValue={location}
                label="Location"
                pattern={contentPatterns.label}
                required={false}
                autoComplete="off"
                onChange={(e) => dispatchApptConfig({ type: 'edit_string', key: 'location', value: e.target.value })}
            />
        </div>
    )
}