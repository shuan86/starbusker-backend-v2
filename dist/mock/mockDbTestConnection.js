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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockConnection = void 0;
const typeorm_1 = require("typeorm");
const ormconfig_1 = __importDefault(require("../config/ormconfig"));
const memberRepo_1 = require("../repositories/memberRepo");
const buskerRepo_1 = require("../repositories/buskerRepo");
const app_1 = require("../app");
// import { clear as clearBuskerData } from '../repositories/per'
exports.mockConnection = {
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield typeorm_1.createConnection(ormconfig_1.default);
        });
    },
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            // await clearBuskerData()
            // await clearMemberData()
            if (app_1.redisClient) {
                app_1.redisClient.quit();
            }
            yield typeorm_1.getConnection().close();
        });
    },
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection();
            const entities = connection.entityMetadatas;
            yield Promise.all(entities.map((entity) => __awaiter(this, void 0, void 0, function* () {
                const repository = connection.getRepository(entity.name);
                yield repository.query(`DELETE FROM ${entity.tableName}`);
            })));
        });
    },
    clearAllRepo() {
        return __awaiter(this, void 0, void 0, function* () {
            yield buskerRepo_1.clear();
            yield memberRepo_1.clear();
            // const connection = getConnection();
            // const entities = connection.entityMetadatas;
            // await Promise.all(entities.map(async (entity) => {
            //     const repository = connection.getRepository(entity.name);
            //     await repository.query(`DELETE FROM ${entity.tableName}`);
            // }));
        });
    },
};
//# sourceMappingURL=mockDbTestConnection.js.map