"use client"

import type { MembersState, EventTableConfig } from "../config-types";
import { membersApiUrl } from "../config-urls";
import { useFetchData } from "@/components/tools/api";

export default function useMembers({ eventId, role }: EventTableConfig){
    const { data: members, setData: setMembers, refetch } = useFetchData<MembersState>({
        apiUrl: membersApiUrl({ eventId, role }),
        autoFetch: false,
        defaultState: 'loading',
        waitingState: 'loading',
        badState: 'error'
    })
    return { members, setMembers, refetch }
}