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
        const decodedUTF8 = crypt.decryptQRCodeAlphanumeric(string)
        if(!decodedUTF8){
            throw 'INVALID'
        }
        const utf8Decoder = new TextDecoder('utf-8', { fatal: true })
        return utf8Decoder.decode(decodedUTF8)
    } catch(e){
        return 'INVALID QR CODE FORMAT'
    }
}