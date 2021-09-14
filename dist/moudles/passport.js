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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const memberRepo_1 = require("../repositories/memberRepo");
const passport_line_auth_1 = __importDefault(require("passport-line-auth"));
const lineStrategy = passport_line_auth_1.default.Strategy;
const passport_facebook_1 = __importDefault(require("passport-facebook"));
const FacebookStrategy = passport_facebook_1.default.Strategy;
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const googleStrategy = passport_google_oauth20_1.default.Strategy;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envSetup_1 = require("../envSetup");
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: envSetup_1.envSetup() });
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
passport_1.default.use(new lineStrategy({
    channelID: process.env.LINE_LOGIN_CHANNEL_ID,
    channelSecret: process.env.LINE_LOGIN_CHANNEL_SECRET,
    callbackURL: process.env.LINE_LOGIN_CALLBACK_URL,
    scope: ['profile', 'openid', 'email'],
    botPrompt: 'normal'
}, (accessToken, refreshToken, params, profile, cb) => {
    return cb(null, jsonwebtoken_1.default.decode(params.id_token));
}));
passport_1.default.use(new FacebookStrategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: process.env.FB_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'photos', 'email', 'gender']
}, (accessToken, refreshToken, profile, done) => {
    done(null, {
        name: profile.displayName, email: profile.emails[0].value, picture: profile.photos[0].value
    });
}));
passport_1.default.use(new googleStrategy({
    clientID: process.env.GOOGLE_KEY,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (token, tokenSecret, profile, done) => {
    console.log(profile);
    done(null, {
        name: profile.displayName, email: profile.emails[0].value, picture: profile.photos[0].value
    });
}));
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map