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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberRoutes = void 0;
const route_abstract_1 = __importDefault(require("./route.abstract"));
const router_1 = require("../config/router");
const memberController = __importStar(require("../controllers/memberController"));
const auth_1 = require("../middlewares/auth");
const rsaDecrypt_1 = require("../middlewares/rsaDecrypt");
const auth_2 = require("../middlewares/auth");
class MemberRoutes extends route_abstract_1.default {
    // private memberController: MemberController = new MemberController();
    constructor() {
        super();
        this.setRoutes();
    }
    setRoutes() {
        this.router.get('/test', (req, res) => {
            res.status(200).send('you called user path test!');
        });
        this.router.route(router_1.apiPath.enroll)
            .post(memberController.enroll);
        this.router.route(router_1.apiPath.login)
            .post(rsaDecrypt_1.loginRsaDecrypt, memberController.login);
        this.router.route(router_1.apiPath.line)
            .get(memberController.loginWithLine());
        this.router.route(router_1.apiPath.lineCallback)
            .get(memberController.lineCallback);
        this.router.route(router_1.apiPath.fb)
            .get(memberController.loginWithFB());
        this.router.route(router_1.apiPath.fbCallback)
            .get(memberController.fbCallback);
        this.router.route(router_1.apiPath.google)
            .get(memberController.loginWithGoogle());
        this.router.route(router_1.apiPath.googleCallback)
            .get(memberController.googleCallback);
        this.router.route(router_1.apiPath.logout)
            .post(auth_1.authMember, memberController.logout);
        this.router.route(router_1.apiPath.memberInfo)
            .get(auth_1.authMember, memberController.getMemberInfo);
        this.router.route(router_1.apiPath.memberInfo)
            .put(auth_1.authMember, auth_2.upload.single('avatar'), memberController.updateMemberInfo);
        this.router.route(router_1.apiPath.password)
            .put(auth_1.authMember, memberController.updatePassword);
    }
}
exports.MemberRoutes = MemberRoutes;
//# sourceMappingURL=member.routes.js.map