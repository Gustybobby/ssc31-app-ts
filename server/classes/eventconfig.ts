import { EventConfigPosition, EventConfigRole } from "@/server/typeconfig/form"

export type EventConfigProperty = {
    id: string
    positions: EventConfigPosition[]
    roles: EventConfigRole[]
}

export default class EventConfig{
    id: string
    positions: EventConfigPosition[]
    roles: EventConfigRole[]

    constructor(eventConfig?: EventConfigProperty){
        this.id = eventConfig?.id ?? ''
        this.positions = eventConfig?.positions ?? []
        this.roles = eventConfig?.roles ?? []
    }

    getPositionDataAccessOptions(global_position_access: { id: string }[]){
        return this.getPositionOptionsActiveByList(global_position_access)
    }

    getRoleDataAccessOptions(global_role_access: { id: string }[]){
        return this.getRoleOptionsActiveByList(global_role_access)
    }

    getPositionRestrictOptions(position_restricts: { id: string }[]){
        return this.getPositionOptionsActiveByList(position_restricts)
    }

    getRoleRestrictOptions(role_restricts: { id: string }[]){
        return this.getRoleOptionsActiveByList(role_restricts)
    }

    getPositionFieldAccessOptions(position_access: string[]){
        return this.getPositionOptionsActiveByList(position_access.map((id) => ({ id })))
    }

    getRoleFieldAccessOptions(role_access: string[]){
        return this.getRoleOptionsActiveByList(role_access.map((id) => ({ id })))
    }

    getPositionOptionsActiveByList(activeList: { id: string }[]){
        return this.positions.map((position,index)=>({
            id: position.id ?? 'MISSING_ID',
            label: position.label ?? 'MISSING_LABEL',
            index,
            active: !!activeList.find(({ id }) => (id === position.id ?? '')),
        })) ?? []
    }

    getRoleOptionsActiveByList(activeList: { id: string }[]){
        return this.roles.map((role,index)=>({
            id: role.id ?? 'MISSING_ID',
            label: role.label ?? 'MISSING_LABEL',
            index,
            active: !!activeList.find(({ id }) => (id === role.id ?? '')),
        })) ?? []
    }
}