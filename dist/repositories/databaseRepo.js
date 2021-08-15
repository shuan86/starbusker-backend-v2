"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuskerPerformanceRepo = exports.getBuskerRepo = exports.getMemberRepos = void 0;
const typeorm_1 = require("typeorm");
const Member_1 = require("../entities/Member");
const Busker_1 = require("../entities/Busker");
const BuskerPerformance_1 = require("../entities/BuskerPerformance");
const getMemberRepos = () => {
    // const connection = getConnection();
    // const repository = connection.getRepository(Member);
    // return repository
    return typeorm_1.getRepository(Member_1.Member);
};
exports.getMemberRepos = getMemberRepos;
const getBuskerRepo = () => {
    // const connection = getConnection();
    // const repository = connection.getRepository(Busker);
    // return repository
    return typeorm_1.getRepository(Busker_1.Busker);
};
exports.getBuskerRepo = getBuskerRepo;
const getBuskerPerformanceRepo = () => {
    // const connection = getConnection();
    // const repository = connection.getRepository(Busker);
    // return repository
    return typeorm_1.getRepository(BuskerPerformance_1.BuskerPerformance);
};
exports.getBuskerPerformanceRepo = getBuskerPerformanceRepo;
//# sourceMappingURL=databaseRepo.js.map