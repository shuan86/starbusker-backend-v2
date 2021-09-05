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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRsaDecrypt = void 0;
const rsa_1 = require("../moudles/rsa");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const Member_1 = require("../entities/Member");
const loginRsaDecrypt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const encryptData = req.body.encryptData;
    const data = rsa_1.decrypt(encryptData);
    const member = class_transformer_1.plainToClass(Member_1.LoginType, JSON.parse(data));
    const errors = yield class_validator_1.validate(member, { skipMissingProperties: true });
    // if (errors.length == 0) {
    //     req.body.account = member.account
    //     req.body.password = member.password
    //     next()
    //     return
    // }
    // res.status(400).send(`parameter error`);
    req.body.account = member.account;
    req.body.password = member.password;
    next();
});
exports.loginRsaDecrypt = loginRsaDecrypt;
//# sourceMappingURL=rsaDecrypt.js.map