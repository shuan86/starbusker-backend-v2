import { Member } from "../entities/Member";
import { IMember } from "../interfaces/IMember";
import { getMemberRepos } from './databaseRepo'
import { LoginType, FrontEndMemberDataType } from "../types/memberType";
import { ReponseType } from "../types/reponseType";
import { buskerRepo } from "./buskerRepo";
export class MemberRepo {
    public mockMemberCount = 0

    /**
     * name
     */


    public generateLoginData(account: string, password: string): LoginType {
        const data: LoginType = new LoginType(account, password)
        return data
    }
    public generateFixedMemberMockData(): Member {
        const mockData = { id: 0, account: `t${this.mockMemberCount}`, password: '123', male: true, email: `t${this.mockMemberCount}@gmail.com`, name: `${this.mockMemberCount}_name`, exp: this.mockMemberCount }
        const mockMember = Object.assign(new Member(), mockData)
        return mockMember
    }
    public generateDiffMemberMockData(): Member {
        const mockData = { id: 0, account: `a${this.mockMemberCount}`, password: '123', male: true, email: `a${this.mockMemberCount}@gmail.com`, name: `${this.mockMemberCount}_name`, exp: this.mockMemberCount }
        const mockMember = Object.assign(new Member(), mockData)
        return mockMember
    }
    public async clearAllData() {
        // try {
        //     const repo = getMemberRepos()
        //     await repo.query(`DELETE FROM member;`);
        //     return true
        // } catch (error) {
        //     console.error('error:clearAllData:', error);

        // }
        // return false
    }
    public async enroll(member: Member): Promise<ReponseType> {
        let repoData: ReponseType = { status: 501, data: '' }
        try {
            const repo = getMemberRepos()
            const isMemberExist: Member = await repo.findOne({ account: member.account })
            if (isMemberExist) {
                console.log(`enroll fail:${member.account} is exist`);
                repoData.data = 'enroll fail:memberExist'
                repoData.status = 401
                return repoData
            }
            else {
                await repo.save(member)
                console.log('enroll suessful:', member.account);
                repoData.status = 200
                repoData.data = 'enroll suessful'
                return repoData
            }

        } catch (error) {
            console.error('error enroll fail:', error);
        }
        return repoData
    }
    public async login(data: LoginType): Promise<ReponseType> {
        let repoData: ReponseType = { status: 501, data: '' }
        try {
            const repo = getMemberRepos()
            const member: Member = await repo.findOne({ account: data.account, password: data.password })
            if (member != undefined) {
                console.log('login sucessful:', member);
                const isBusker = await buskerRepo.isBuskerByMemberId(member.id)
                repoData.status = 200
                const frontEndMemberData: FrontEndMemberDataType = {
                    account: member.account,
                    male: member.male,
                    email: member.email,
                    name: member.name,
                    exp: member.exp,
                    avatar: member.avatar,
                    isBusker: isBusker
                }
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
        }
        return repoData
    }

    public async getIdByAccount(account: string): Promise<number> {
        try {
            const repo = getMemberRepos()
            const member = await repo.findOne({ account })
            if (member)
                return member.id
            else
                return -1
        } catch (error) {
            console.error('getIdByAccount:', error);
        }
    }

}
export const memberRepo = new MemberRepo()

