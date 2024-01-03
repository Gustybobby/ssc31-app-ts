import { GustybobbyOption } from "./typeconfig/form";

export function stringifyGustybobbySelection(options: GustybobbyOption[], optionState: { [key: string]: boolean }){
    const optionStrings = []
    for(const option of options){
        if(optionState[option.id]){
            optionStrings.push(`${option.id}:${option.label}//${option.index}`)
        }
    }
    return optionStrings.join('|')
}

export function getOptionStateFromSelection(selectionString: string){
    const optionState: { [key: string]: boolean } = {}
    const optionStrings = selectionString.split('|')
    for(const string of optionStrings){
        const id = string.split(':')[0]
        optionState[id] = true
    }
    return optionState
}