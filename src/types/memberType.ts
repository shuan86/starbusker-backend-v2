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
export class UpdateMemberInfoType {
    name: string
    email: string
    password: string
    constructor(name: string, email: string, password: string) {
        this.name = name
        this.email = email
        this.password = password
    }
}