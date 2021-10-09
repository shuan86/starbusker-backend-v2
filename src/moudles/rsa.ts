import NodeRSA from "node-rsa"
import { publicKey, privateKey } from "../config/rsaKey";
// 加密方法
export const encrypt = (data: string): string => {
    try {
        const key = new NodeRSA(publicKey);
        key.setOptions({ encryptionScheme: 'pkcs1' }); // 因为jsencrypt自身使用的是pkcs1加密方案, nodejs需要修改成pkcs1。
        const encrypted = key.encrypt(data, 'base64');
        return encrypted;

    } catch (error) {
        console.error('encrypt error:', error);
    }
}
// 解密方法
export const decrypt = (encrypted: string): string => {
    try {
        const key = new NodeRSA(privateKey);
        key.setOptions({ encryptionScheme: 'pkcs1' }); // 因为jsencrypt自身使用的是pkcs1加密方案, nodejs需要修改成pkcs1。
        const decrypted = key.decrypt(encrypted, 'utf8');
        return decrypted;
    } catch (error) {
        console.error('decrypt error:', error);
    }
}

