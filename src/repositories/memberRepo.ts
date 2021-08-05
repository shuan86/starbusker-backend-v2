import { Member } from "../entities/Member";
import { IMember } from "../interfaces/IMember";
import { RepoStatusData, getMemberRepos } from './databaseRepo'
export class MemberRepo {
    public mockMemberCount = 0
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
    public async enroll(member: Member): Promise<RepoStatusData> {
        let repoData: RepoStatusData = { status: 501, msg: '' }
        try {
            const repo = getMemberRepos()
            const isMemberExist = await repo.findOne({ account: member.account })
            if (isMemberExist) {
                console.log(`enroll fail:${member.account} is exist`);
                repoData.msg = 'enroll fail:memberExist'
                repoData.status = 401
                return repoData
            }
            else {
                await repo.save(member)
                console.log('enroll suessful:', member.account);
                repoData.status = 200
                repoData.msg = 'enroll suessful'
                return repoData
            }

        } catch (error) {
            console.error('error enroll fail:', error);
        }
        return repoData
    }
}
export const memberRepo = new MemberRepo()


