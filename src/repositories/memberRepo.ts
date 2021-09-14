import { Member, LoginModeEnum, LoginType, FrontEndMemberDataType, UpdateMemberInfoType } from "../entities/Member";
import { IMember } from "../interfaces/IMember";
import { getMemberRepos } from './databaseRepo'
import { ReponseType } from "../types/reponseType";
import * as buskerRepo from "./buskerRepo";
import fs from "fs";
let mockMemberCount = 0
export const setMockMemberCount = (count: number) => {
    mockMemberCount = 0;
}

export const generateLoginData = (account: string, password: string): LoginType => {
    const data: LoginType = new LoginType(account, password)

    return data
}
export const generateMemberInfoData = (account: string, email: string): UpdateMemberInfoType => {
    const data: UpdateMemberInfoType = new UpdateMemberInfoType(account, email)
    return data
}

export const generateFixedMemberMockData = (): Member => {
    const mockData: Member = new Member(`t${mockMemberCount}`, '123', true, `t${mockMemberCount}@gmail.com`, `${mockMemberCount}_name`, null, LoginModeEnum.local, '')
    // {
    //     id: 0, account: `t${mockMemberCount}`, password: '123', male: true
    //         , email: `t${mockMemberCount}@gmail.com`
    //             , name: `${mockMemberCount}_name`, exp: mockMemberCount, avatar: null, buskers: undefined, buskerPerformanceComments: undefined
    // }
    // const mockMember = Object.assign(new Member(), mockData)
    return mockData
}

export const generateDiffMemberMockData = async (): Promise<Member> => {

    try {
        const r = Math.floor(Math.random() * 4) + 1;
        let imageData = null
        if (r < 4) {
            imageData = fs.readFileSync(`${__dirname}/../public/img/busker0${r}.png`)
        }
        const mockData: Member = new Member(`t${mockMemberCount}`, '123', true, `t${mockMemberCount}@gmail.com`, `${mockMemberCount}_name`, imageData, LoginModeEnum.local, '')

        // const mockData: Member = {
        //     id: 0, account: `t${mockMemberCount}`, password: '123'
        //     , male: true, email: `t${mockMemberCount}@gmail.com`
        //     , name: `${mockMemberCount}_name`, exp: mockMemberCount, avatar: imageData, buskers: undefined, buskerPerformanceComments: undefined
        // }
        mockMemberCount++
        return mockData
    } catch (error) {
        console.error('generateDiffMemberMockData error:', error);

    }

}
export const enroll = async (data: Member): Promise<ReponseType> => {
    let repoData: ReponseType = { status: 501, data: '' }
    try {
        const memberRepo = getMemberRepos()
        const member = await createMember(data)
        if (member == null) {
            repoData.data = 'enroll fail:memberExist'
            repoData.status = 401
        }
        else {
            console.log('enroll suessful:', data.account);
            repoData.status = 200
            repoData.data = 'enroll suessful'
        }

        return repoData
    } catch (error) {
        console.error('error enroll fail:', error);
        return repoData
    }
}
export const createMember = async (data: Member): Promise<Member> => {
    try {
        const memberRepo = getMemberRepos()
        const checkMemberAccount: Member = await memberRepo.findOne({ account: data.account })
        const checkMemberEmail: Member = await memberRepo.findOne({ email: data.email })

        if (checkMemberAccount || checkMemberEmail) {
            return null
        }
        else {
            return await memberRepo.save(memberRepo.create(data))
        }
    } catch (error) {
        console.error('createMember:', error);
        return null
    }
}
export const loginByAccountPasswd = async (account: string, password: string): Promise<ReponseType> => {
    let repoData: ReponseType = { status: 501, data: '' }
    try {
        const repo = getMemberRepos()
        const member: Member = await repo.findOne({ account, password })
        if (member != undefined) {
            console.log('login sucessful:', member);
            const frontEndMemberData = await getMemberInfoDataById(member.id)
            repoData.status = 200
            repoData.data = JSON.stringify(frontEndMemberData)
            return repoData
        }
        else {
            repoData.status = 401
            repoData.data = 'login fail'
            return repoData
        }
    } catch (error) {
        console.error('login fail:', error);
        return repoData
    }
}
export const login = async (data: LoginType): Promise<ReponseType> => {
    let repoData: ReponseType = { status: 501, data: '' }
    try {
        const repo = getMemberRepos()
        const member: Member = await repo.findOne({ account: data.account, password: data.password })
        if (member != undefined) {
            console.log('login sucessful:', member);
            const frontEndMemberData = await getMemberInfoDataById(member.id)
            repoData.status = 200
            repoData.data = JSON.stringify(frontEndMemberData)
            return repoData
        }
        else {
            repoData.status = 401
            repoData.data = 'login fail'
            return repoData
        }
    } catch (error) {
        console.error('login fail:', error);
        return repoData
    }
}

export const getMemberInfoById = async (id: number): Promise<ReponseType> => {
    let repoData: ReponseType = { status: 501, data: '' }

    try {
        const repo = getMemberRepos()
        const member = await repo.findOne({ id })
        if (member) {
            const frontEndMemberData = await getMemberInfoDataById(id)
            repoData.status = 200
            repoData.data = JSON.stringify(frontEndMemberData)
            return repoData
        }
        else {
            repoData.status = 401
            repoData.data = 'failed to get member info'
            return repoData
        }
    }
    catch (error) {
        console.error('getMemberInfoById:', error);
        return repoData
    }
}
export const getMemberAvatarByAccount = async (account: string): Promise<string> => {
    try {
        const repo = getMemberRepos()
        const member = await repo.findOne({ account })
        if (member) {
            return member.avatar == null ? '' : Buffer.from(member.avatar).toString('base64')
        }
        else
            return ''
    }
    catch (error) {
        console.error('getMemberAvatarByAccount error:', error);
        return ''
    }
}
export const getMemberInfoDataById = async (id: number): Promise<FrontEndMemberDataType> => {
    try {
        const repo = getMemberRepos()
        const member = await repo.findOne({ id })
        if (member) {
            const isBusker = await buskerRepo.isBuskerByMemberId(member.id)
            const frontEndMemberData: FrontEndMemberDataType = {
                account: member.account,
                male: member.male,
                email: member.email,
                name: member.name,
                exp: member.exp,
                avatar: member.avatar == null ? '' : Buffer.from(member.avatar).toString('base64'),//member.avatar(blob) if you want to send image data ,you need to convert blob object into base64 string
                isBusker: isBusker
            }
            return frontEndMemberData
        }
        else
            return null
    }
    catch (error) {
        console.error('getMemberInfoDataById:', error);
        return null
    }
}
export const updateMemberInfoById = async (id: number, infoData: UpdateMemberInfoType): Promise<ReponseType> => {
    let repoData: ReponseType = { status: 501, data: '' }
    try {
        const repo = getMemberRepos()
        const member = await repo.findOne({ id })
        if (member) {
            member.name = infoData.name
            member.email = infoData.email
            member.avatar = infoData.avatar
            const isBusker = await buskerRepo.isBuskerByMemberId(member.id)
            await repo.save({ ...member })
            repoData.status = 200
            const data: FrontEndMemberDataType = {
                account: member.account,
                male: member.male,
                email: member.email,
                name: member.name,
                exp: member.exp,
                avatar: member.avatar == null ? '' : Buffer.from(member.avatar).toString('base64'),
                isBusker: isBusker
            }
            repoData.data = JSON.stringify(data)
        }
        else {
            repoData.status = 401
            repoData.data = 'failed to get member info'
        }
        return repoData
    }
    catch (error) {
        console.error('getMemberInfoById:', error);
        return repoData

    }
}

export const getIdByAccount = async (account: string): Promise<number> => {
    try {
        const repo = getMemberRepos()
        const member = await repo.findOne({ account })
        if (member)
            return member.id
        else
            return -1
    } catch (error) {
        console.error('getIdByAccount:', error);
        return -1
    }
}
export const getIdByEmail = async (email: string): Promise<number> => {
    try {
        const repo = getMemberRepos()
        const member = await repo.findOne({ email })
        if (member)
            return member.id
        else
            return -1
    } catch (error) {
        console.error('getIdByEmail:', error);
        return -1
    }
}
export const updateMemberPassword = async (id: number, oldPassword: string, newPassword: string): Promise<ReponseType> => {
    let repoData: ReponseType = { status: 501, data: '' }
    try {
        const memberRepo = getMemberRepos()
        const member = await memberRepo.findOne({ id })
        if (member && member.password === oldPassword) {
            member.password = newPassword
            await memberRepo.update(id, member)
            repoData.status = 200
            repoData.data = ''
        }
        else {
            repoData.status = 401
            repoData.data = 'failed to updated password'
        }
        return repoData
    }
    catch (error) {
        console.error('updateMemberPassword:', error);
        return repoData

    }
}


export const clear = async () => {
    const memberRepo = getMemberRepos()
    const members = await memberRepo.find()
    for (const m of members) {
        await memberRepo.remove(m)
    }
}