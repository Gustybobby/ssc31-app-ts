import type { AppointmentConfig, DefaultGroupTableConfig, EventTableConfig, FormTableConfig } from "./config-types"

export const eventApiUrl = ({ eventId, role }: EventTableConfig) => (
    `/api/${role}/events/${eventId}?id=1&positions=1&roles=1`
)

export const formApiUrl = ({ eventId, formId, role }: FormTableConfig) => (
    `/api/${role}/events/${eventId}/forms/${formId}?id=1&title=1&field_order=1&form_fields=1`
)

export const membersApiUrl = ({ eventId, role }: EventTableConfig) => (
    `/api/${role}/events/${eventId}/members?id=1&status=1&position=1&role=1`
)

export const appointmentMembersApiUrl = ({ eventId, role, apptId }: AppointmentConfig) => (
    `/api/${role}/events/${eventId}/appointments/${apptId}?party_members=1`
)

export const formResponseApiUrl = ({ eventId, formId, role }: FormTableConfig) => (
    `/api/${role}/events/${eventId}/forms/${formId}/responses?id=1&member_id=1&response=1`
)

export const eventColumnFetchesApiUrl = ({ eventId, role, tableView, apptId }: DefaultGroupTableConfig) => (
    `/api/${role}/events/${eventId}/column-fetches?${tableView? `table_view=${tableView}` : ''}${apptId? `&appt_id=${apptId}` : ''}`
)

export const attendancesApiUrl = ({ eventId, role, apptId, memberId }: {
    eventId: string
    role: 'user' | 'gustybobby'
    apptId: string
    memberId: string
}) => (
    `/api/${role}/events/${eventId}/members/${memberId}/appointments/${apptId}/attendances`
)

export const memberSelectionsApiUrl = ({ eventId, formId, role }: FormTableConfig) => (
    `/api/${role}/events/${eventId}/forms/${formId}/selections`
)