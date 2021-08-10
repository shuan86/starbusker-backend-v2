"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberRepo = exports.MemberRepo = void 0;
const Member_1 = require("../entities/Member");
const databaseRepo_1 = require("./databaseRepo");
const memberType_1 = require("../types/memberType");
const buskerRepo_1 = require("./buskerRepo");
class MemberRepo {
    constructor() {
        this.mockMemberCount = 0;
    }
    /**
     * name
     */
    generateLoginData(account, password) {
        const data = new memberType_1.LoginType(account, password);
        return data;
    }
    generateFixedMemberMockData() {
        const mockData = { id: 0, account: `t${this.mockMemberCount}`, password: '123', male: true, email: `t${this.mockMemberCount}@gmail.com`, name: `${this.mockMemberCount}_name`, exp: this.mockMemberCount };
        const mockMember = Object.assign(new Member_1.Member(), mockData);
        return mockMember;
    }
    generateDiffMemberMockData() {
        const mockData = { id: 0, account: `a${this.mockMemberCount}`, password: '123', male: true, email: `a${this.mockMemberCount}@gmail.com`, name: `${this.mockMemberCount}_name`, exp: this.mockMemberCount };
        const mockMember = Object.assign(new Member_1.Member(), mockData);
        return mockMember;
    }
    clearAllData() {
        return __awaiter(this, void 0, void 0, function* () {
            // try {
            //     const repo = getMemberRepos()
            //     await repo.query(`DELETE FROM member;`);
            //     return true
            // } catch (error) {
            //     console.error('error:clearAllData:', error);
            // }
            // return false
        });
    }
    enroll(member) {
        return __awaiter(this, void 0, void 0, function* () {
            let repoData = { status: 501, data: '' };
            try {
                const repo = databaseRepo_1.getMemberRepos();
                const isMemberExist = yield repo.findOne({ account: member.account });
                if (isMemberExist) {
                    console.log(`enroll fail:${member.account} is exist`);
                    repoData.data = 'enroll fail:memberExist';
                    repoData.status = 401;
                    return repoData;
                }
                else {
                    yield repo.save(member);
                    console.log('enroll suessful:', member.account);
                    repoData.status = 200;
                    repoData.data = 'enroll suessful';
                    return repoData;
                }
            }
            catch (error) {
                console.error('error enroll fail:', error);
            }
            return repoData;
        });
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let repoData = { status: 501, data: '' };
            try {
                const repo = databaseRepo_1.getMemberRepos();
                const member = yield repo.findOne({ account: data.account, password: data.password });
                if (member != undefined) {
                    console.log('login sucessful:', member);
                    const isBusker = yield buskerRepo_1.buskerRepo.isBuskerByMemberId(member.id);
                    repoData.status = 200;
                    const frontEndMemberData = {
                        account: member.account,
                        male: member.male,
                        email: member.email,
                        name: member.name,
                        exp: member.exp,
                        avatar: member.avatar,
                        isBusker: isBusker
                    };
                    repoData.data = JSON.stringify(frontEndMemberData);
                    return repoData;
                }
                else {
                    repoData.status = 401;
                    repoData.data = 'login fail';
                    return repoData;
                }
            }
            catch (error) {
                console.error('error login fail:', error);
            }
            return repoData;
        });
    }
    getIdByAccount(account) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const repo = databaseRepo_1.getMemberRepos();
                const member = yield repo.findOne({ account });
                if (member)
                    return member.id;
                else
                    return -1;
            }
            catch (error) {
                console.error('getIdByAccount:', error);
            }
        });
    }
}
exports.MemberRepo = MemberRepo;
exports.memberRepo = new MemberRepo();
//# sourceMappingURL=memberRepo.js.map