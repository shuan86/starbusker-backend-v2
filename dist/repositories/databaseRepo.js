"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuskerRepo = exports.getMemberRepos = void 0;
const typeorm_1 = require("typeorm");
const Member_1 = require("../entities/Member");
const Busker_1 = require("../entities/Busker");
const getMemberRepos = () => {
    return typeorm_1.getRepository(Member_1.Member);
};
exports.getMemberRepos = getMemberRepos;
const getBuskerRepo = () => {
    return typeorm_1.getRepository(Busker_1.Busker);
};
exports.getBuskerRepo = getBuskerRepo;
//# sourceMappingURL=databaseRepo.js.map