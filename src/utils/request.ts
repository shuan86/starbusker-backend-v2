
import { encrypt } from "../moudles/rsa";
type EncryptPostType = {
    encryptData: string
}
type PostType = {
    data: string
}
export const generateEncryptPostData = (data): EncryptPostType => {
    const jsonStr = JSON.stringify(data)
    const encryptData = encrypt(jsonStr)
    const postData: EncryptPostType = { encryptData }
    return postData
}
export const generatePostData = (data): PostType => {
    const jsonStr = JSON.stringify(data)
    const postData: PostType = { data: jsonStr }
    return postData
}
