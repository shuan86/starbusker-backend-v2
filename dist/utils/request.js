"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSendData = exports.generateEncryptSendData = void 0;
const rsa_1 = require("../moudles/rsa");
const generateEncryptSendData = (data) => {
    const jsonStr = JSON.stringify(data);
    const encryptData = rsa_1.encrypt(jsonStr);
    const sendData = { encryptData };
    return sendData;
};
exports.generateEncryptSendData = generateEncryptSendData;
const generateSendData = (data) => {
    const jsonStr = JSON.stringify(data);
    const sendData = { data: jsonStr };
    return sendData;
};
exports.generateSendData = generateSendData;
//# sourceMappingURL=request.js.map