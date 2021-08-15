"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const envSetup_1 = require("../envSetup");
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: envSetup_1.envSetup() });
// const env = envSetup()
// const config: ConnectionOptions = {
//   type: "mysql",
//   host: process.env.MYSQL_HOST,
//   port: 3306,
//   username: process.env.MYSQL_USERNAME,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DB,
//   entities: [
//     __dirname + "/../entities/*.js"
//   ],
//   synchronize: true,
//   logging: false,
//   dropSchema: false
// }
const config = {
    type: "mysql",
    host: process.env.MYSQL_HOST,
    port: 3306,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    entities: [
        __dirname + "/../entities/*{.ts,.js}"
    ],
    synchronize: true,
    logging: false,
    dropSchema: true
};
exports.default = config;
//# sourceMappingURL=ormconfig.js.map