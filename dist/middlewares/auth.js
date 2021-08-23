"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMember = void 0;
const authMember = (req, res, next) => {
    console.log('logout:', req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.status(401).send('you need to login first');
    }
};
exports.authMember = authMember;
//# sourceMappingURL=auth.js.map