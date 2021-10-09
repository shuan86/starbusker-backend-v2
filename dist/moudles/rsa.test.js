"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rsa_1 = require("./rsa");
let encryptedStr;
beforeAll(() => {
    encryptedStr = rsa_1.encrypt('Hello');
});
describe('rea test', () => {
    it(`test encrypt:it should be return Hello  if use ${encryptedStr}`, () => {
        const result = rsa_1.decrypt(encryptedStr);
        expect(result).toBe('Hello');
    });
});
//# sourceMappingURL=rsa.test.js.map