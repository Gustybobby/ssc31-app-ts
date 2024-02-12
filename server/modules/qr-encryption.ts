import Cryptr from "cryptr";

function initCryptr(){
    if(!process.env.QR_SECRET_KEY){
        throw 'undefined env variables'
    }
    const cryptr = new Cryptr(process.env.QR_SECRET_KEY, { encoding: 'base64' })
    return cryptr
}

export function encryptQR(string: string){
    const cryptr = initCryptr()
    const encodedString = cryptr.encrypt(string)
    return encodedString
}

export function decryptQR(string: string){
    const cryptr = initCryptr()
    try {
        const decodedString = cryptr.decrypt(string)
        return decodedString
    } catch(e){
        return 'INVALID QR CODE FORMAT'
    }
}