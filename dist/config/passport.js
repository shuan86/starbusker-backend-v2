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
// passport.use('login', new LocalStrategy({
//     passReqToCallback: true
// },
//     async (req, username, password, done) => {
//         const encryptData = req.body.encryptData
//         console.log('data:', req.body.encryptData);
//         done(null, encryptData);
//     }))
passport_1.default.use('login', new LocalStrategy({
    usernameField: "account",
    passwordField: 'password',
}, (account, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield memberRepo_1.loginByAccountPasswd(account, password);
    return done(null, result, { message: '123' });
})));
// passport.use('login', new LocalStrategy({
//     usernameField: "account",
//     passwordField: 'password',
// },
//     async (account, password, done) => {
//         // const encryptData = req.body.encryptData
//         // const data = decrypt(encryptData)
//         // const member = plainToClass(LoginType, JSON.parse(data))
//         // const errors = await validate(member, { skipMissingProperties: true })
//         // if (errors.length > 0) {
//         //     return done(errors, '')
//         // } else {
//         //     console.log('member:', member);
//         //     const result = await login(member)
//         //     if (result.status == 200) {
//         //         return done(null, result)
//         //     }
//         //     else if (result.status == 401) {
//         //         return done(null, result)
//         //     }
//         //     else {
//         //     }
//         // }
//         // return done(undefined, true, { message: '123' });
//     }
// ));
// passport.use(new LocalStrategy({ usernameField: "account", passwordField: 'password' }, (account, password, done) => {
//     return done(undefined, true, { message: Email ${account} not found. });
// }));
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map