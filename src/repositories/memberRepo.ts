import { Member } from "../entities/Member";
import { IMember } from "../interfaces/IMember";
import { getMemberRepos } from './databaseRepo'
import { LoginType, FrontEndMemberDataType, UpdateMemberInfoType } from "../types/memberType";
import { ReponseType } from "../types/reponseType";
import * as buskerRepo from "./buskerRepo";
let mockMemberCount = 0
export const generateLoginData = (account: string, password: string): LoginType => {
    const data: LoginType = new LoginType(account, password)

    return data
}
export const generateMemberInfoData = (account: string, password: string, email: string): UpdateMemberInfoType => {
    const data: UpdateMemberInfoType = new UpdateMemberInfoType(account, password, email)
    return data
}
export const generateFixedMemberMockData = (): Member => {
    const mockData: Member = {
        id: 0, account: `t${mockMemberCount}`, password: '123', male: true
        , email: `t${mockMemberCount}@gmail.com`
        , name: `${mockMemberCount}_name`, exp: mockMemberCount, avatar: '', buskers: []
    }
    // const mockMember = Object.assign(new Member(), mockData)
    return mockData
}

export const generateDiffMemberMockData = (): Member => {
    // const mockData = { id: 0, account: `a${mockMemberCount}`, password: '123', male: true, email: `a${mockMemberCount}@gmail.com`, name: `${mockMemberCount}_name`, exp: mockMemberCount }
    // const mockMember = Object.assign(new Member(), mockData)
    // mockMemberCount++
    const mockData: Member = {
        id: 0, account: `a${mockMemberCount}`, password: '123'
        , male: true, email: `a${mockMemberCount}@gmail.com`
        , name: `${mockMemberCount}_name`, exp: mockMemberCount, avatar: '', buskers: []
    }
    mockMemberCount++
    return mockData
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
        const member: Member = await memberRepo.findOne({ account: data.account })
        if (member) {
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
        console.error('error login fail:', error);
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
                avatar: member.avatar,
                isBusker: isBusker
            }
            return frontEndMemberData
        }
        else
            return null
    }
    catch (error) {
        console.error('getMemberInfoById:', error);
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
            member.password = infoData.password
            await repo.save({ ...member })
            repoData.status = 200
            repoData.data = ''
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

export const clear = async () => {
    const memberRepo = getMemberRepos()
    const members = await memberRepo.find()
    for (const m of members) {
        await memberRepo.remove(m)
    }
}