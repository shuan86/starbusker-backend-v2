"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.authMember = void 0;
const multer_1 = __importDefault(require("multer"));
const authMember = (req, res, next) => {
    // console.log('logout:',req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.status(401).send('you need to login first');
    }
};
exports.authMember = authMember;
exports.upload = multer_1.default({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter(req, file, callback) {
        if (!file.mimetype.match(/^image/)) {
            console.log('upload error');
            callback(new Error('檔案格式錯誤'));
        }
        else {
            console.log('upload correct');
            callback(null, true);
        }
    }
});
//# sourceMappingURL=auth.js.map