import { ShortCrypt } from "short-crypt"

function initCrypt(){
    if(!process.env.QR_SECRET_KEY){
        throw 'undefined env variables'
    }
    const crypt = new ShortCrypt(process.env.QR_SECRET_KEY)
    return crypt
}

export function encryptQR(string: string){
    const crypt = initCrypt()
    const encodedString = crypt.encryptToQRCodeAlphanumeric(string)
    return encodedString
}

export function decryptQR(string: string){
    const crypt = initCrypt()
    try {
        const decodedString = crypt.decryptQRCodeAlphanumeric(string)
        if(!decodedString){
            throw 'INVALID'
        }
        return String(decodedString)
    } catch(e){
        return 'INVALID QR CODE FORMAT'
    }
}