import type { FormResponse, GustybobbyOption } from "@/server/typeconfig/form"

export type FieldVisibilityProperty = {
    boolCode: 'AND' | 'OR' | 'NONE'
    triggerFieldOptions?: TriggerFieldOptions
}

export type TriggerFieldOptions = {
    [key: string]: number[]
}

export const visibilityBoolCodes = ['AND', 'OR', 'NONE']

export default class FieldVisibility {
    boolCode: FieldVisibilityProperty['boolCode']
    triggerFieldOptions?: TriggerFieldOptions

    constructor(fieldVisibility?: FieldVisibilityProperty) {
        this.boolCode = fieldVisibility?.boolCode ?? 'NONE'
        this.triggerFieldOptions = fieldVisibility?.triggerFieldOptions
    }

    static fromString(visible_conds: string){
        const fieldVisibility = new FieldVisibility()
        fieldVisibility.setFromString(visible_conds)
        return fieldVisibility
    }

    static clone(field_visibility: FieldVisibility){
        const clonedTriggers = {...field_visibility.triggerFieldOptions}
        for(const id of Object.keys(clonedTriggers)){
            clonedTriggers[id] = [...field_visibility.triggerFieldOptions?.[id] ?? []]
        }
        return new FieldVisibility({
            boolCode: field_visibility.boolCode,
            triggerFieldOptions: clonedTriggers
        })
    }

    static validateString(visible_conds: string) {
        if(visible_conds === '' || visibilityBoolCodes.includes(visible_conds)){
            return
        }
        FieldVisibility.hardValidateString(visible_conds)
    }

    static hardValidateString(visible_conds: string){
        if (visible_conds.split("|").length !== 2) {
            throw `${visible_conds} is not a valid FieldVisibility Format`
        }
        for (const subString of visible_conds.split("|")[1].split(",")) {
            if (subString.split(":").length !== 2) {
                throw `${visible_conds} is not a valid FieldVisibility Format`
            }
        }
    }

    isVisible(response: FormResponse) {
        if (this.boolCode === 'NONE' || !this.triggerFieldOptions){
            return true
        }
        switch (this.boolCode){
            case 'AND':
                for (const [id, optionList] of Object.entries(this.triggerFieldOptions)) {
                    let count = 0
                    for(const selection of response[id]?.split('|') ?? []){
                        if(optionList.includes(Number(selection.split('//')[1]))){
                            count++
                        }
                        if(count >= optionList.length){
                            break
                        }
                    }
                    if(count < optionList.length){
                        return false
                    }
                }
                return true
            case 'OR':
                for (const [id, optionList] of Object.entries(this.triggerFieldOptions)) {
                    for(const selection of response[id]?.split('|') ?? []){
                        if(optionList.includes(Number(selection.split('//')[1]))){
                            return true
                        }
                    }
                }
                return false
        }
    }

    stringify(){
        if(!this.triggerFieldOptions || Object.keys(this.triggerFieldOptions).length === 0){
            return this.boolCode
        }
        const fieldOptionStringList = []
        for(const field_id of Object.keys(this.triggerFieldOptions)){
            fieldOptionStringList.push(this.triggerFieldOptions[field_id].map((option_index) => {
                return `${field_id}:${option_index}`
            }).join(','))
        }
        return `${this.boolCode}|${fieldOptionStringList.join(',')}`
    }

    setFromString(visible_conds: string) {
        FieldVisibility.validateString(visible_conds)
        if(visible_conds === ''){
            return
        }
        const [boolCode, fieldString] = visible_conds.split("|")
        if(boolCode === 'AND' || boolCode === 'OR'){
            this.boolCode = boolCode
        } else{
            this.boolCode = 'NONE'
        }
        if(!fieldString){
            return
        }
        this.triggerFieldOptions = this.triggerFieldOptions ?? {}
        for (const subString of fieldString.split(",")) {
            const [field_id, option_index] = subString.split(":")
            this.triggerFieldOptions[field_id] = this.triggerFieldOptions[field_id] ?? []
            this.triggerFieldOptions[field_id].push(Number(option_index))
        }
    }

    setTriggersFromGustybobbies(options: GustybobbyOption[]){
        this.triggerFieldOptions = {}
        for (const option of options){
            const field_id = option.id.split('_')[0]
            this.triggerFieldOptions[field_id] = this.triggerFieldOptions[field_id] ?? []
            this.triggerFieldOptions[field_id].push(option.index)
        }
    }
}