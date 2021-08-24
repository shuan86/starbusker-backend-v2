
import { encrypt } from "../moudles/rsa";
type EncryptSendDataType = {
    encryptData: string
}
type SendDataType = {
    data: string
}
export const generateEncryptSendData = (data): EncryptSendDataType => {
    const jsonStr = JSON.stringify(data)
    const encryptData = encrypt(jsonStr)
    const postData: EncryptSendDataType = { encryptData }
    return postData
}
export const generateSendData = (data): SendDataType => {
    const jsonStr = JSON.stringify(data)
    const postData: SendDataType = { data: jsonStr }
    return postData
}
