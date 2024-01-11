import type { FormTableConfig } from "./config-types"

export const formApiUrl = ({ eventId, formId, role }: FormTableConfig) => (
    `/api/${role}/events/${eventId}/forms/${formId}?id=1&title=1&field_order=1&form_fields=1`
)

export const membersApiUrl = ({ eventId, role }: FormTableConfig) => (
    `/api/${role}/events/${eventId}/members`
)

export const formResponseApiUrl = ({ eventId, formId, role }: FormTableConfig) => (
    `/api/${role}/events/${eventId}/forms/${formId}/responses`
)