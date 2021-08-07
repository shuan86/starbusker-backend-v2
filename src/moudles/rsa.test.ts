import { decrypt, encrypt } from "./rsa";
let encryptedStr: string
beforeAll(() => {
    encryptedStr = encrypt('Hello')

})
describe('rea test', () => {
    it(`test encrypt:it should be return Hello  if use ${encryptedStr}`, () => {
        const result = decrypt(encryptedStr)
        expect(result).toBe('Hello')
    })
})