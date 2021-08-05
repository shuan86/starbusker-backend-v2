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
class MemberRepo {
    constructor() {
        this.mockMemberCount = 0;
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
            let repoData = { status: 501, msg: '' };
            try {
                const repo = databaseRepo_1.getMemberRepos();
                const isMemberExist = yield repo.findOne({ account: member.account });
                if (isMemberExist) {
                    console.log(`enroll fail:${member.account} is exist`);
                    repoData.msg = 'enroll fail:memberExist';
                    repoData.status = 401;
                    return repoData;
                }
                else {
                    yield repo.save(member);
                    console.log('enroll suessful:', member.account);
                    repoData.status = 200;
                    repoData.msg = 'enroll suessful';
                    return repoData;
                }
            }
            catch (error) {
                console.error('error enroll fail:', error);
            }
            return repoData;
        });
    }
}
exports.MemberRepo = MemberRepo;
exports.memberRepo = new MemberRepo();
//# sourceMappingURL=memberRepo.js.map