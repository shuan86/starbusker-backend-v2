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
exports.db = void 0;
const typeorm_1 = require("typeorm");
const ormconfig_1 = require("../config/ormconfig");
const Member_1 = require("../entities/Member");
const Busker_1 = require("../entities/Busker");
// const dbSetup = async () => {
//     try {
//         const connection = await createConnection(config)
//         console.log("Has connected to DB? ", connection.isConnected);
//         return connection
//     } catch (error) {
//         console.log("TypeORM connection error: ", error)
//     }
// }
// const conn = dbSetup()
// export const getMemberRepos = (): Repository<Member> => {
//     return conn.getRepository(Member)
// }
// export const getBuskerRepo = (): Repository<Busker> => {
//     return conn.getRepository(Busker)
// }
class DatabaseRepo {
    setUp() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield typeorm_1.createConnection(ormconfig_1.default);
                console.log("Has connected to DB? ", connection.isConnected);
                this.conn = connection;
                return connection;
            }
            catch (error) {
                console.log("TypeORM connection error: ", error);
            }
        });
    }
    getMemberRepos() {
        return this.conn.getRepository(Member_1.Member);
    }
    getBuskerRepo() {
        return this.conn.getRepository(Busker_1.Busker);
    }
}
exports.db = new DatabaseRepo();
exports.db.setUp();
//# sourceMappingURL=repo.js.map