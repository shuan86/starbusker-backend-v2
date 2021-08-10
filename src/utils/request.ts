
import { encrypt } from "../moudles/rsa";
type EncryptPostType = {
    encryptData: string
}
export const generateEncryptPostData = (data): EncryptPostType => {
    const jsonStr = JSON.stringify(data)
    const encryptData = encrypt(jsonStr)
    const enrollPostData: EncryptPostType = { encryptData }
    return enrollPostData
}
