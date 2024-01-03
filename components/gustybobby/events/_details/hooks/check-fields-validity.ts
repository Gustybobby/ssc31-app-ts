import type { EventDataRequest } from "@/server/typeconfig/event"

export default function checkFieldsValidity(positions: EventDataRequest['positions'], roles: EventDataRequest['roles'], document: Document){
    if(positions.length === 0 || roles.length === 0){
        throw 'At least 1 position and role'
    }
    const positionLabels = positions.map(({ label }) => label)
    if(new Set(positionLabels).size != positionLabels.length){
        throw 'Duplicate positions'
    }
    const roleLabels = roles.map(({ label }) => label)
    if(new Set(roleLabels).size != roleLabels.length){
        throw 'Duplicate roles'
    }
    for(const field of positions){
        const element = document.getElementById(`${field.id}_VALIDITY`) as HTMLInputElement
        if(element?.value === 'false'){
            throw 'Invalid positions'
        }
    }
    for(const field of roles){
        const element = document.getElementById(`${field.id}_VALIDITY`) as HTMLInputElement
        if(element?.value === 'false'){
            throw 'Invalid roles'
        }
    }
}