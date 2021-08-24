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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const memberRepo_1 = require("../repositories/memberRepo");
const LocalStrategy = passport_local_1.default.Strategy;
passport_1.default.serializeUser((id, done) => {
    console.log('serializeUser:', id);
    //req.login 可以觸發 serializeUser
    // 只將用戶 id 序列化存到 session 中
    done(null, id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    // 使用者 id 會存在req.user
    done(null, id);
}));
passport_1.default.use('login', new LocalStrategy({
    usernameField: "account",
    passwordField: 'password',
    passReqToCallback: true
}, (req, account, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield memberRepo_1.loginByAccountPasswd(account, password);
    if (result.status == 200) {
        const member = yield memberRepo_1.getIdByAccount(account);
        req.login(member, (err) => {
            if (err) {
                console.error('err:', err);
            }
        });
        return done(null, result);
    }
    return done(null, false);
})));
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map