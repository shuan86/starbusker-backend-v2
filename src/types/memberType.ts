export class LoginType {
    account: string
    password: string
    constructor(account: string, password: string) {
        this.account = account
        this.password = password
    }
}
export type FrontEndMemberDataType = {
    account: string
    male: boolean
    email: string
    name: string
    exp: number
    avatar: string
    isBusker: boolean
}