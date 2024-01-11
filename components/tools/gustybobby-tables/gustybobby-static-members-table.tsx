"use client"

import StaticMembersTableConfigFetcher from "./config-fetchers/static-members-table-config-fetcher"

export default function GustybobbyStaticMembersTable({ eventId, formId, role }: {
    eventId: string,
    formId: string,
    role: 'user' | 'gustybobby',
}){
    return(
        <StaticMembersTableConfigFetcher
            eventId={eventId}
            formId={formId}
            role={role}
        />
    )
}