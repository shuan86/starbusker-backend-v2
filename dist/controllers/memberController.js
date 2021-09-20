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
exports.updatePassword = exports.updateMemberInfo = exports.getMemberInfo = exports.logout = exports.googleCallback = exports.loginWithGoogle = exports.fbCallback = exports.loginWithFB = exports.lineCallback = exports.loginWithLine = exports.login = exports.enroll = exports.init = void 0;
const Member_1 = require("../entities/Member");
const memberRepo = __importStar(require("../repositories/memberRepo"));
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const rsa_1 = require("../moudles/rsa");
const Member_2 = require("../entities/Member");
const passport_1 = __importDefault(require("../moudles/passport"));
const envSetup_1 = require("../envSetup");
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: envSetup_1.envSetup() });
const init = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield memberRepo.enroll(memberRepo.generateFixedMemberMockData());
        res.status(200).send('sucessful init');
    }
    catch (error) {
        console.error('api enroll error:', error);
    }
});
exports.init = init;
const enroll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const encryptData = req.body.encryptData;
        const data = rsa_1.decrypt(encryptData);
        const member = class_transformer_1.plainToClass(Member_1.Member, JSON.parse(data));
        const errors = yield class_validator_1.validate(member, { skipMissingProperties: true });
        if (errors.length > 0) {
            // console.error(errors);
            res.status(400).send(`parameter error`);
            return;
        }
        else {
            const result = yield memberRepo.enroll(member);
            if (result.status == 200 || result.status == 401) {
                res.status(result.status).send(result.data);
            }
            else {
                res.status(500).send('server is busying');
            }
        }
    }
    catch (error) {
        console.error('api enroll error:', error);
    }
});
exports.enroll = enroll;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate('login', (err, data, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (data == false)
            res.status(401).send('login fail');
        const result = data;
        res.status(result.status).send(result.data);
    }))(req, res);
});
exports.login = login;
const loginWithLine = () => {
    return passport_1.default.authenticate('line');
};
exports.loginWithLine = loginWithLine;
const lineCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate('line', (err, data, info) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, picture, name } = data;
        const memberId = yield memberRepo.getIdByEmail(email);
        const url = `${process.env.CLIENT_URL}?loginMode=line`;
        if (memberId == -1) {
            const member = yield memberRepo.createMember(new Member_1.Member(email, name + '465789', true, email, name, picture, Member_1.LoginModeEnum.Line, ''));
            req.login(member.id, (err) => {
                if (err) {
                    console.error('err:', err);
                }
            });
            const result = yield memberRepo.getMemberInfoById(member.id);
            res.status(result.status).redirect(url);
        }
        else {
            yield memberRepo.updateMemberLoginMode(memberId, Member_1.LoginModeEnum.Line);
            yield memberRepo.updateMemberInfoById(memberId, { email, avatar: picture, name });
            req.login(memberId, (err) => {
                if (err) {
                    console.error('err:', err);
                }
            });
            res.status(200).redirect(url);
        }
    }))(req, res);
});
exports.lineCallback = lineCallback;
const loginWithFB = () => {
    return passport_1.default.authenticate('facebook', { scope: ['email'] });
};
exports.loginWithFB = loginWithFB;
const fbCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate('facebook', (err, data, info) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, picture, name } = data;
        const memberId = yield memberRepo.getIdByEmail(email);
        const url = `${process.env.CLIENT_URL}?loginMode=facebook`;
        if (memberId == -1) {
            const member = yield memberRepo.createMember(new Member_1.Member(email, name + '465789', true, email, name, picture, Member_1.LoginModeEnum.Facebook, ''));
            req.login(member.id, (err) => {
                if (err) {
                    console.error('err:', err);
                }
            });
            const result = yield memberRepo.getMemberInfoById(member.id);
            res.status(result.status).redirect(url);
        }
        else {
            yield memberRepo.updateMemberLoginMode(memberId, Member_1.LoginModeEnum.Facebook);
            yield memberRepo.updateMemberInfoById(memberId, { email, avatar: picture, name });
            req.login(memberId, (err) => {
                if (err) {
                    console.error('err:', err);
                }
            });
            res.status(200).redirect(url);
        }
    }))(req, res);
});
exports.fbCallback = fbCallback;
const loginWithGoogle = () => {
    return passport_1.default.authenticate('google', { scope: ['profile', 'email'] });
};
exports.loginWithGoogle = loginWithGoogle;
const googleCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate('google', (err, data, info) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, picture, name } = data;
        const memberId = yield memberRepo.getIdByEmail(email);
        const url = `${process.env.CLIENT_URL}?loginMode=facebook`;
        if (memberId == -1) {
            const member = yield memberRepo.createMember(new Member_1.Member(email, name + '465789', true, email, name, picture, Member_1.LoginModeEnum.Goolgle, ''));
            req.login(member.id, (err) => {
                if (err) {
                    console.error('err:', err);
                }
            });
            const result = yield memberRepo.getMemberInfoById(member.id);
            res.status(result.status).redirect(url);
        }
        else {
            yield memberRepo.updateMemberLoginMode(memberId, Member_1.LoginModeEnum.Goolgle);
            yield memberRepo.updateMemberInfoById(memberId, { email, avatar: picture, name });
            req.login(memberId, (err) => {
                if (err) {
                    console.error('err:', err);
                }
            });
            res.status(200).redirect(url);
        }
    }))(req, res);
});
exports.googleCallback = googleCallback;
const logout = (req, res) => {
    try {
        //    console.log('logout:',req.isAuthenticated());
        req.logOut();
        req.session.destroy(() => {
            console.log('session destroyed');
        });
        res.status(200).send('');
    }
    catch (error) {
        console.error('api logout error:', error);
    }
};
exports.logout = logout;
const getMemberInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const memberId = req.user;
        const result = yield memberRepo.getMemberInfoById(memberId);
        res.status(result.status).send(result.data);
    }
    catch (error) {
        console.error('api getMemberInfo error:', error);
    }
});
exports.getMemberInfo = getMemberInfo;
const updateMemberInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {
            name: req.body.name,
            email: req.body.email,
            avatar: req.file ? req.file.buffer : null
        };
        const infoData = class_transformer_1.plainToClass(Member_2.UpdateMemberInfoType, data);
        const errors = yield class_validator_1.validate(infoData, { skipMissingProperties: true });
        if (errors.length > 0) {
            res.status(400).send(`parameter error`);
            return;
        }
        else {
            const memberId = req.user;
            const result = yield memberRepo.updateMemberInfoById(memberId, infoData);
            res.status(result.status).send(result.data);
        }
    }
    catch (error) {
        console.error('api updateMemberInfo error:', error);
    }
});
exports.updateMemberInfo = updateMemberInfo;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const encryptData = req.body.encryptData;
        const data = rsa_1.decrypt(encryptData);
        const member = class_transformer_1.plainToClass(Member_2.UpdatePassword, JSON.parse(data));
        const errors = yield class_validator_1.validate(member);
        if (errors.length > 0) {
            res.status(400).send(`parameter error`);
            return;
        }
        else {
            const result = yield memberRepo.updateMemberPassword(req.user, member.oldPassword, member.newPassword);
            if (result.status == 200 || result.status == 401) {
                res.status(result.status).send(result.data);
            }
            else {
                res.status(500).send('server is busying');
            }
        }
    }
    catch (error) {
        console.error('api updatePassword error:', error);
    }
});
exports.updatePassword = updatePassword;
//# sourceMappingURL=memberController.js.map