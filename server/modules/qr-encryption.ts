import Cryptr from "cryptr";

if(!process.env.QR_SECRET_KEY){
    throw 'undefined env variables'
}
const cryptr = new Cryptr(process.env.QR_SECRET_KEY, { encoding: 'base64' })

export function encryptQR(string: string){
    return cryptr.encrypt(string)
}

export function decryptQR(string: string){
    return cryptr.decrypt(string)
}