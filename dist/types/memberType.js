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
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
}
exports.UpdateMemberInfoType = UpdateMemberInfoType;
//# sourceMappingURL=memberType.js.map