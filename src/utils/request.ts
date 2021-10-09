
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
    const sendData: EncryptSendDataType = { encryptData }
    return sendData
}
export const generateSendData = (data): SendDataType => {
    const jsonStr = JSON.stringify(data)
    const sendData: SendDataType = { data: jsonStr }
    return sendData
}
