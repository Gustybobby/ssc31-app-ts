const charList = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','A','B','C','D','E','F','G']

export function generateRandomId(length: number){
    let id = ""
    for(var i=0;i<length;i++){
        id += randomCharFromCharList()
    }
    return id
}

function randomCharFromCharList(){
    const randomIndex = Math.max(0,Math.ceil(Math.random()*charList.length) - 1)
    return charList[randomIndex]
}