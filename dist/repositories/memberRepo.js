"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clear = exports.updateMemberPassword = exports.getIdByAccount = exports.updateMemberInfoById = exports.getMemberInfoDataById = exports.getMemberAvatarByAccount = exports.getMemberInfoById = exports.login = exports.loginByAccountPasswd = exports.createMember = exports.enroll = exports.generateDiffMemberMockData = exports.generateFixedMemberMockData = exports.generateMemberInfoData = exports.generateLoginData = exports.setMockMemberCount = void 0;
const Member_1 = require("../entities/Member");
const databaseRepo_1 = require("./databaseRepo");
const buskerRepo = __importStar(require("./buskerRepo"));
const fs_1 = __importDefault(require("fs"));
let mockMemberCount = 0;
const setMockMemberCount = (count) => {
    mockMemberCount = 0;
};
exports.setMockMemberCount = setMockMemberCount;
const generateLoginData = (account, password) => {
    const data = new Member_1.LoginType(account, password);
    return data;
};
exports.generateLoginData = generateLoginData;
const generateMemberInfoData = (account, email) => {
    const data = new Member_1.UpdateMemberInfoType(account, email);
    return data;
};
exports.generateMemberInfoData = generateMemberInfoData;
const generateFixedMemberMockData = () => {
    const mockData = {
        id: 0, account: `t${mockMemberCount}`, password: '123', male: true,
        email: `t${mockMemberCount}@gmail.com`,
        name: `${mockMemberCount}_name`, exp: mockMemberCount, avatar: null, buskers: undefined, buskerPerformanceComments: undefined
    };
    // const mockMember = Object.assign(new Member(), mockData)
    return mockData;
};
exports.generateFixedMemberMockData = generateFixedMemberMockData;
const generateDiffMemberMockData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const r = Math.floor(Math.random() * 4) + 1;
        let imageData = null;
        if (r < 4) {
            imageData = fs_1.default.readFileSync(`${__dirname}/../public/img/busker0${r}.png`);
        }
        const mockData = {
            id: 0, account: `t${mockMemberCount}`, password: '123',
            male: true, email: `t${mockMemberCount}@gmail.com`,
            name: `${mockMemberCount}_name`, exp: mockMemberCount, avatar: imageData, buskers: undefined, buskerPerformanceComments: undefined
        };
        mockMemberCount++;
        return mockData;
    }
    catch (error) {
        console.error('generateDiffMemberMockData error:', error);
    }
});
exports.generateDiffMemberMockData = generateDiffMemberMockData;
const enroll = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const memberRepo = databaseRepo_1.getMemberRepos();
        const member = yield exports.createMember(data);
        if (member == null) {
            repoData.data = 'enroll fail:memberExist';
            repoData.status = 401;
        }
        else {
            console.log('enroll suessful:', data.account);
            repoData.status = 200;
            repoData.data = 'enroll suessful';
        }
        return repoData;
    }
    catch (error) {
        console.error('error enroll fail:', error);
        return repoData;
    }
});
exports.enroll = enroll;
const createMember = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const memberRepo = databaseRepo_1.getMemberRepos();
        const member = yield memberRepo.findOne({ account: data.account });
        if (member) {
            return null;
        }
        else {
            return yield memberRepo.save(memberRepo.create(data));
        }
    }
    catch (error) {
        console.error('createMember:', error);
        return null;
    }
});
exports.createMember = createMember;
const loginByAccountPasswd = (account, password) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const repo = databaseRepo_1.getMemberRepos();
        const member = yield repo.findOne({ account, password });
        if (member != undefined) {
            console.log('login sucessful:', member);
            const frontEndMemberData = yield exports.getMemberInfoDataById(member.id);
            repoData.status = 200;
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
        console.error('login fail:', error);
        return repoData;
    }
});
exports.loginByAccountPasswd = loginByAccountPasswd;
const login = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const repo = databaseRepo_1.getMemberRepos();
        const member = yield repo.findOne({ account: data.account, password: data.password });
        if (member != undefined) {
            console.log('login sucessful:', member);
            const frontEndMemberData = yield exports.getMemberInfoDataById(member.id);
            repoData.status = 200;
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
        console.error('login fail:', error);
        return repoData;
    }
});
exports.login = login;
const getMemberInfoById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const repo = databaseRepo_1.getMemberRepos();
        const member = yield repo.findOne({ id });
        if (member) {
            const frontEndMemberData = yield exports.getMemberInfoDataById(id);
            repoData.status = 200;
            repoData.data = JSON.stringify(frontEndMemberData);
            return repoData;
        }
        else {
            repoData.status = 401;
            repoData.data = 'failed to get member info';
            return repoData;
        }
    }
    catch (error) {
        console.error('getMemberInfoById:', error);
        return repoData;
    }
});
exports.getMemberInfoById = getMemberInfoById;
const getMemberAvatarByAccount = (account) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repo = databaseRepo_1.getMemberRepos();
        const member = yield repo.findOne({ account });
        if (member) {
            return member.avatar == null ? '' : Buffer.from(member.avatar).toString('base64');
        }
        else
            return '';
    }
    catch (error) {
        console.error('getMemberAvatarByAccount error:', error);
        return '';
    }
});
exports.getMemberAvatarByAccount = getMemberAvatarByAccount;
const getMemberInfoDataById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repo = databaseRepo_1.getMemberRepos();
        const member = yield repo.findOne({ id });
        if (member) {
            const isBusker = yield buskerRepo.isBuskerByMemberId(member.id);
            const frontEndMemberData = {
                account: member.account,
                male: member.male,
                email: member.email,
                name: member.name,
                exp: member.exp,
                avatar: member.avatar == null ? '' : Buffer.from(member.avatar).toString('base64'),
                isBusker: isBusker
            };
            return frontEndMemberData;
        }
        else
            return null;
    }
    catch (error) {
        console.error('getMemberInfoById:', error);
        return null;
    }
});
exports.getMemberInfoDataById = getMemberInfoDataById;
const updateMemberInfoById = (id, infoData) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const repo = databaseRepo_1.getMemberRepos();
        const member = yield repo.findOne({ id });
        if (member) {
            member.name = infoData.name;
            member.email = infoData.email;
            member.avatar = infoData.avatar;
            const isBusker = yield buskerRepo.isBuskerByMemberId(member.id);
            yield repo.save(Object.assign({}, member));
            repoData.status = 200;
            const data = {
                account: member.account,
                male: member.male,
                email: member.email,
                name: member.name,
                exp: member.exp,
                avatar: member.avatar == null ? '' : Buffer.from(member.avatar).toString('base64'),
                isBusker: isBusker
            };
            repoData.data = JSON.stringify(data);
        }
        else {
            repoData.status = 401;
            repoData.data = 'failed to get member info';
        }
        return repoData;
    }
    catch (error) {
        console.error('getMemberInfoById:', error);
        return repoData;
    }
});
exports.updateMemberInfoById = updateMemberInfoById;
const getIdByAccount = (account) => __awaiter(void 0, void 0, void 0, function* () {
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
        return -1;
    }
});
exports.getIdByAccount = getIdByAccount;
const updateMemberPassword = (id, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const memberRepo = databaseRepo_1.getMemberRepos();
        const member = yield memberRepo.findOne({ id });
        if (member && member.password === oldPassword) {
            member.password = newPassword;
            yield memberRepo.update(id, member);
            repoData.status = 200;
            repoData.data = '';
        }
        else {
            repoData.status = 401;
            repoData.data = 'failed to updated password';
        }
        return repoData;
    }
    catch (error) {
        console.error('updateMemberPassword:', error);
        return repoData;
    }
});
exports.updateMemberPassword = updateMemberPassword;
const clear = () => __awaiter(void 0, void 0, void 0, function* () {
    const memberRepo = databaseRepo_1.getMemberRepos();
    const members = yield memberRepo.find();
    for (const m of members) {
        yield memberRepo.remove(m);
    }
});
exports.clear = clear;
//# sourceMappingURL=memberRepo.js.map