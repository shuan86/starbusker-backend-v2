"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const node_rsa_1 = __importDefault(require("node-rsa"));
const rsaKey_1 = require("../config/rsaKey");
// 加密方法
const encrypt = (data) => {
    try {
        const key = new node_rsa_1.default(rsaKey_1.publicKey);
        key.setOptions({ encryptionScheme: 'pkcs1' }); // 因为jsencrypt自身使用的是pkcs1加密方案, nodejs需要修改成pkcs1。
        const encrypted = key.encrypt(data, 'base64');
        return encrypted;
    }
    catch (error) {
        console.error('encrypt error:', error);
    }
};
exports.encrypt = encrypt;
// 解密方法
const decrypt = (encrypted) => {
    try {
        const key = new node_rsa_1.default(rsaKey_1.privateKey);
        key.setOptions({ encryptionScheme: 'pkcs1' }); // 因为jsencrypt自身使用的是pkcs1加密方案, nodejs需要修改成pkcs1。
        const decrypted = key.decrypt(encrypted, 'utf8');
        return decrypted;
    }
    catch (error) {
        console.error('decrypt error:', error);
    }
};
exports.decrypt = decrypt;
//# sourceMappingURL=rsa.js.map