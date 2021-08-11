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
exports.buskerRepo = exports.BuskerRepo = void 0;
const Busker_1 = require("../entities/Busker");
const databaseRepo_1 = require("./databaseRepo");
class BuskerRepo {
    constructor() {
        this.mockCount = 0;
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
    generateFixedMockData(memberId) {
        const mockData = { id: 0, memberId: memberId, kind: Busker_1.BuskerKind.singer, description: `description`, member: null };
        // const mockMember = Object.assign(new Busker(), mockData)
        return mockData;
    }
    generateDiffMockData(memberId) {
        const mockData = { id: 0, memberId: memberId, kind: Busker_1.BuskerKind.singer, description: `description${this.mockCount}`, member: null };
        this.mockCount++;
        return mockData;
    }
    apply(memberId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let repoData = { status: 501, data: '' };
            try {
                const repo = databaseRepo_1.getBuskerRepo();
                const isBuskerExist = yield repo.findOne({ memberId: memberId });
                if (isBuskerExist) {
                    repoData.data = 'failed to apply';
                    repoData.status = 401;
                    return repoData;
                }
                else {
                    yield repo.save(data);
                    repoData.status = 200;
                    repoData.data = '';
                    return repoData;
                }
            }
            catch (error) {
                console.error('apply error:', error);
            }
            return repoData;
        });
    }
    applyPerformance(memberId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let repoData = { status: 501, data: '' };
            try {
                const repo = databaseRepo_1.getBuskerRepo();
                const isBuskerExist = yield repo.findOne({ memberId: memberId });
                if (isBuskerExist) {
                    const d = { a: 123 };
                    yield repo.save(Object.assign({}, data));
                    repoData.status = 200;
                    repoData.data = '';
                    return repoData;
                }
                else {
                    repoData.data = 'failed to apply';
                    repoData.status = 401;
                    return repoData;
                }
            }
            catch (error) {
                console.error('apply error:', error);
            }
            return repoData;
        });
    }
    isBuskerByMemberId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const repo = databaseRepo_1.getBuskerRepo();
                const busker = yield repo.findOne({ id });
                if (busker)
                    return true;
                else
                    return false;
            }
            catch (error) {
                console.error('isBuskerByMemberId:', error);
            }
        });
    }
    getIdByMemberId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const repo = databaseRepo_1.getBuskerRepo();
                const busker = yield repo.findOne({ id });
                if (busker)
                    return busker;
                else
                    return null;
            }
            catch (error) {
                console.error('getIdByAccount:', error);
            }
        });
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
}
exports.BuskerRepo = BuskerRepo;
exports.buskerRepo = new BuskerRepo();
//# sourceMappingURL=buskerRepo.js.map