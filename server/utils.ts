export type DynamicKey = 'event_id' | 'form_id' | 'appointment_id' | 'baan_id'

export type RouteParams = {
    [key in DynamicKey]?: string
}

export function searchParamsToSelect(searchParams: URLSearchParams){
    const select: { [key: string]: boolean } = {}
    searchParams.forEach((value, key) => {
        select[key] = !!Number(value)
    })
    if(Object.keys(select).length === 0){
        return undefined
    }
    return select
}