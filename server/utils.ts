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

export function compoundAccessEvaluation({ role_access, position_access, role_id, position_id }: {
    role_access: string[]
    position_access: string[]
    role_id: string | null
    position_id: string | null
}): boolean{
    const accessIsEmpty = position_access.length === 0 && role_access.length === 0
    const hasPositionAccess = position_access.length === 0 || !!(position_id && position_access.includes(position_id))
    const hasRoleAccess = role_access.length === 0 || !!(role_id && role_access.includes(role_id))
    return !accessIsEmpty && hasPositionAccess && hasRoleAccess
}