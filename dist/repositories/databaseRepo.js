"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuskerPerformanceCommentRepo = exports.getBuskerPerformanceRepo = exports.getBuskerRepo = exports.getMemberRepos = void 0;
const typeorm_1 = require("typeorm");
const Member_1 = require("../entities/Member");
const Busker_1 = require("../entities/Busker");
const BuskerPerformance_1 = require("../entities/BuskerPerformance");
const BuskerPerformanceComment_1 = require("../entities/BuskerPerformanceComment");
const getMemberRepos = () => {
    return typeorm_1.getRepository(Member_1.Member);
};
exports.getMemberRepos = getMemberRepos;
const getBuskerRepo = () => {
    return typeorm_1.getRepository(Busker_1.Busker);
};
exports.getBuskerRepo = getBuskerRepo;
const getBuskerPerformanceRepo = () => {
    return typeorm_1.getRepository(BuskerPerformance_1.BuskerPerformance);
};
exports.getBuskerPerformanceRepo = getBuskerPerformanceRepo;
const getBuskerPerformanceCommentRepo = () => {
    return typeorm_1.getRepository(BuskerPerformanceComment_1.BuskerPerformanceComment);
};
exports.getBuskerPerformanceCommentRepo = getBuskerPerformanceCommentRepo;
//# sourceMappingURL=databaseRepo.js.map