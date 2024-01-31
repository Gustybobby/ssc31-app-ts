"use client"

import { useFetchData } from "@/components/tools/api"
import type { ColumnFetchesState, EventTableConfig } from "../config-types"

export default function useColumnFetches({ eventId, role }: EventTableConfig){
    const { data: columnFetches, setData: setColumnFetches, refetch } = useFetchData<ColumnFetchesState>({
        apiUrl: `/api/${role}/events/${eventId}?column_fetches=1`,
        autoFetch: false,
        defaultState: 'loading',
        badState: 'error',
        accessor: 'column_fetches'
    })
    return { columnFetches, setColumnFetches, refetch }
}