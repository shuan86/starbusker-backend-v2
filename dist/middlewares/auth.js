"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMember = void 0;
const authMember = (req, res, next) => {
    if (req.session.member) {
        next();
    }
    else {
        res.status(401).send('logout fail');
    }
};
exports.authMember = authMember;
//# sourceMappingURL=auth.js.map