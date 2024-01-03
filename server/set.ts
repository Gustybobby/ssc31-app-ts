export function setDifference<T>(setA: Set<T>, setB: Set<T>){
    const setACopy: Set<T> = new Set(setA)
    setB.forEach((e) => {
        setACopy.delete(e)
    })
    return setACopy
}

export function setIntersection<T>(setA: Set<T>, setB: Set<T>){
    const intersect: Set<T> = new Set()
    setA.forEach((e) => {
        if(setB.has(e)){
            intersect.add(e)
        }
    })
    return intersect
}

export function setUnion<T>(setA: Set<T>, setB: Set<T>){
    const union: Set<T> = new Set()
    setA.forEach((e) => {
        union.add(e)
    })
    setB.forEach((e) => {
        union.add(e)
    })
    return union
}

export function setToArray<T>(set: Set<T>): T[]{
    const array: T[] = []
    set.forEach((e) => array.push(e))
    return array
}

export function setConnections(key: string, newList?: { id: string }[]){
    if(!newList){
        return undefined
    }
    return { [key]: newList }
}

export function stringChanges(string: string, prevString: string){
    const charFreq = getCharFrequency(string)
    const prevCharFreq = getCharFrequency(prevString)
    const changeSet: Set<String> = new Set()
    const allChars = setUnion(new Set(Object.keys(charFreq)), new Set(Object.keys(prevCharFreq)))
    allChars.forEach((char) => {
        if((charFreq[char] ?? 0) !== (prevCharFreq[char] ?? 0)){
            changeSet.add(char)
        }
    })
    return changeSet
}

function getCharFrequency(string: string){
    const charFreq: { [key: string]: number } = {}
    for(const char of string){
        charFreq[char] = charFreq[char] ?? 0
        charFreq[char] +=1
    }
    return charFreq
}