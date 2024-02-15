import { type FieldType, type GustybobbyOption, typePermission } from "./typeconfig/form";

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

export function extractTextFromResponseData(dataString: string, fieldType: FieldType){
    if(typePermission.fieldType.optionsLikeField.has(fieldType) && dataString.includes(':') && dataString.includes('//')){
        const options: string[] = []
        for(const selection of dataString.split('|')){
            options.push(selection.split(':')[1].split('//')[0])
        }
        return options.join(', ')
    }
    return dataString
}