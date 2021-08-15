"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePostData = exports.generateEncryptPostData = void 0;
const rsa_1 = require("../moudles/rsa");
const generateEncryptPostData = (data) => {
    const jsonStr = JSON.stringify(data);
    const encryptData = rsa_1.encrypt(jsonStr);
    const postData = { encryptData };
    return postData;
};
exports.generateEncryptPostData = generateEncryptPostData;
const generatePostData = (data) => {
    const jsonStr = JSON.stringify(data);
    const postData = { data };
    return postData;
};
exports.generatePostData = generatePostData;
//# sourceMappingURL=request.js.map