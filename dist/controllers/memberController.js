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
exports.enroll = void 0;
const Member_1 = require("../entities/Member");
const memberRepo_1 = require("../repositories/memberRepo");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const rsa_1 = require("../moudles/rsa");
const enroll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //decrypt->json parse -> class
    try {
        const encryptData = req.body.encryptData;
        const data = rsa_1.decrypt(encryptData);
        const member = class_transformer_1.plainToClass(Member_1.Member, JSON.parse(data));
        const errors = yield class_validator_1.validate(member, { skipMissingProperties: true });
        if (errors.length > 0) {
            console.error(errors);
            res.status(400).send(errors);
            return;
        }
        else {
            const result = yield memberRepo_1.memberRepo.enroll(member);
            if (result.status == 200) {
                res.status(200).send('enroll sucessful');
            }
            else if (result.status == 400) {
                res.status(400).send('enroll parameter error');
            }
            else if (result.status == 401) {
                res.status(401).send('enroll fail:membe is exist');
            }
            else {
                res.status(500).send('server is busying');
            }
        }
    }
    catch (error) {
        console.error('api enroll error:', error);
    }
});
exports.enroll = enroll;
//# sourceMappingURL=memberController.js.map