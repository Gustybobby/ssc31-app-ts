import type { DistributionMode } from "@/server/modules/hours-modules"

export interface HoursOptionQueryParamsProps {
    startAt: string
    endAt: string
    memberId?: string
    positionId?: string
    roleId?: string
}

export interface HoursAppointmentUrlProps extends HoursOptionQueryParamsProps {
    eventId: string
}

export interface HoursActivityQueryParamsProps extends HoursOptionQueryParamsProps {
    mode: DistributionMode
}

export type HoursActivityUrlProps = HoursAppointmentUrlProps & HoursActivityQueryParamsProps

export const hoursAppointmentUrl = (props: HoursAppointmentUrlProps) => (
    `/api/gustybobby/events/${props.eventId}/hours?` + hoursOptionQueryParams(props)
)

const hoursOptionQueryParams = ({ startAt, endAt, memberId, positionId, roleId }: HoursOptionQueryParamsProps) => ([
    `start_at=${encodeURIComponent(startAt)}&end_at=${encodeURIComponent(endAt)}`,
    memberId? `member_id=${memberId}` : '',
    positionId? `position_id=${positionId}` : '',
    roleId? `role_id=${roleId}` : '',
].filter((string) => string !== '').join('&'))

export const hoursActivityUrl = (props: HoursActivityUrlProps) => (
    `/api/gustybobby/events/${props.eventId}/hours/activity?` + hoursActivityQueryParams(props)
)

const hoursActivityQueryParams = (props: HoursActivityQueryParamsProps) => ([
    `mode=${props.mode}`,
    hoursOptionQueryParams(props),
].join('&'))

