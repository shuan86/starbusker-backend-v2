"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuskerRepo = exports.getMemberRepos = void 0;
const typeorm_1 = require("typeorm");
const Member_1 = require("./entities/Member");
const Busker_1 = require("./entities/Busker");
// const dbSetup = async () => {
//     try {
//         const connection = await createConnection(config)
//         console.log("Has connected to DB? ", connection.isConnected);
//         return connection
//     } catch (error) {
//         console.log("TypeORM connection error: ", error)
//     }
// }
// class DatabaseRepo {
//     public conn: Connection
//     constructor(connection: Connection) {
//         this.conn = connection
//     }
//     public async setup() {
//         try {
//             const connection = await createConnection(config)
//             console.log("Has connected to DB? ", connection.isConnected);
//             return connection
//         } catch (error) {
//             console.log("TypeORM connection error: ", error)
//         }
//     }
//     public getMemberRepos(): Repository<Member> {
//         return this.conn.getRepository(Member)
//     }
//     public getBuskerRepo(): Repository<Busker> {
//         return this.conn.getRepository(Busker)
//     }
// }
// let databaseRepo: DatabaseRepo
// const databaseStart = async () => {
//     console.log("databaseStart");
//     databaseRepo = new DatabaseRepo(await dbSetup())
// }
// databaseStart()
// dbSetup()
// console.log("hello");
const conn = typeorm_1.getConnection();
const getMemberRepos = () => {
    console.log("conn:", conn);
    return conn.getRepository(Member_1.Member);
};
exports.getMemberRepos = getMemberRepos;
const getBuskerRepo = () => {
    return conn.getRepository(Busker_1.Busker);
};
exports.getBuskerRepo = getBuskerRepo;
//# sourceMappingURL=databaseRepo.js.map