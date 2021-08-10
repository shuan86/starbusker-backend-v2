import { Busker } from "../entities/Busker";
import { IMember } from "../interfaces/IMember";
import { getBuskerRepo } from './databaseRepo'
import { LoginType, FrontEndMemberDataType } from "../types/memberType";
import { ReponseType } from "../types/reponseType";
export class BuskerRepo {
    public mockMemberCount = 0
    public async isBuskerByMemberId(id: number): Promise<boolean> {
        try {
            const repo = getBuskerRepo()
            const busker = await repo.findOne({ id })
            if (busker)
                return true
            else
                return false
        } catch (error) {
            console.error('isBuskerByMemberId:', error);
        }
    }
    public async getIdByMemberId(id: number): Promise<Busker> {
        try {
            const repo = getBuskerRepo()
            const busker = await repo.findOne({ id })
            if (busker)
                return busker
            else
                return null
        } catch (error) {
            console.error('getIdByAccount:', error);
        }
    }
    /**
     * name
     */


    // public generateLoginData(account: string, password: string): LoginType {
    //     const data: LoginType = new LoginType(account, password)
    //     return data
    // }
    // public generateFixedMemberMockData(): Member {
    //     const mockData = { id: 0, account: `t${this.mockMemberCount}`, password: '123', male: true, email: `t${this.mockMemberCount}@gmail.com`, name: `${this.mockMemberCount}_name`, exp: this.mockMemberCount }
    //     const mockMember = Object.assign(new Member(), mockData)
    //     return mockMember
    // }
    // public generateDiffMemberMockData(): Member {
    //     const mockData = { id: 0, account: `a${this.mockMemberCount}`, password: '123', male: true, email: `a${this.mockMemberCount}@gmail.com`, name: `${this.mockMemberCount}_name`, exp: this.mockMemberCount }
    //     const mockMember = Object.assign(new Member(), mockData)
    //     return mockMember
    // }
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
    // public async enroll(member: Member): Promise<ReponseType> {
    //     let repoData: ReponseType = { status: 501, data: '' }
    //     try {
    //         const repo = getBuskerRepo()
    //         const isMemberExist: Member = await repo.findOne({ account: member.account })
    //         if (isMemberExist) {
    //             console.log(`enroll fail:${member.account} is exist`);
    //             repoData.data = 'enroll fail:memberExist'
    //             repoData.status = 401
    //             return repoData
    //         }
    //         else {
    //             await repo.save(member)
    //             console.log('enroll suessful:', member.account);
    //             repoData.status = 200
    //             repoData.data = 'enroll suessful'
    //             return repoData
    //         }

    //     } catch (error) {
    //         console.error('error enroll fail:', error);
    //     }
    //     return repoData
    // }



}
export const buskerRepo = new BuskerRepo()


