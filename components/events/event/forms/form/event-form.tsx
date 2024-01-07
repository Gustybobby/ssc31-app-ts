import type { EventConfigProperty } from "@/server/classes/eventconfig";
import type { FormConfigProperty } from "@/server/classes/forms/formconfig";
import EventFormManager from "./handlers/event-form-manager";

export default function EventForm({ event_config, form_config, submitted
}: { event_config: EventConfigProperty, form_config: FormConfigProperty, submitted: boolean }){
    return(
        <EventFormManager
            event_config={event_config}
            form_config={form_config}
            submitted={submitted}
        />
    )
}