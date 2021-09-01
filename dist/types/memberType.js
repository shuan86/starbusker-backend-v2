"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMemberInfoType = exports.LoginType = void 0;
class LoginType {
    constructor(account, password) {
        this.account = account;
        this.password = password;
    }
}
exports.LoginType = LoginType;
class UpdateMemberInfoType {
    constructor(name, email, password, avatar = null) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.avatar = avatar;
    }
}
exports.UpdateMemberInfoType = UpdateMemberInfoType;
//# sourceMappingURL=memberType.js.map