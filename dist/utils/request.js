"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEncryptPostData = void 0;
const rsa_1 = require("../moudles/rsa");
const generateEncryptPostData = (data) => {
    const jsonStr = JSON.stringify(data);
    const encryptData = rsa_1.encrypt(jsonStr);
    const enrollPostData = { encryptData };
    return enrollPostData;
};
exports.generateEncryptPostData = generateEncryptPostData;
//# sourceMappingURL=request.js.map