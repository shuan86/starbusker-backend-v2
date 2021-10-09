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
exports.app = exports.App = exports.sessionMiddleware = exports.redisClient = void 0;
const express_1 = __importDefault(require("express"));
const router_1 = require("./routes/router");
const typeorm_1 = require("typeorm");
const ormconfig_1 = __importDefault(require("./config/ormconfig"));
const cors_1 = __importDefault(require("cors"));
const envSetup_1 = require("./envSetup");
const dotenv = __importStar(require("dotenv"));
const passport_1 = __importDefault(require("./moudles/passport"));
const express_session_1 = __importDefault(require("express-session"));
const redis_1 = __importDefault(require("redis"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const RedisStore = connect_redis_1.default(express_session_1.default);
exports.redisClient = redis_1.default.createClient();
dotenv.config({ path: envSetup_1.envSetup() });
const corsOptions = {
    origin: [
        'http://www.example.com',
        'http://localhost:3000',
        '127.0.0.1:3000',
        '*'
    ],
    // origin: '*',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
};
exports.sessionMiddleware = express_session_1.default({
    store: new RedisStore({ client: exports.redisClient }),
    secret: process.env.SESSION_SECRET,
    name: 'member',
});
class App {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.routerSetup();
        if (process.env.mode == 'prod' || process.env.mode == 'dev') {
            this.dbSetup();
        }
        else if (process.env.mode == 'test') {
        }
    }
    config() {
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use(express_1.default.json());
        this.app.use(cors_1.default(corsOptions));
        //express-session -> passport.initialize -> passport.session
        this.app.use(exports.sessionMiddleware);
        // 初始化 Passport
        this.app.use(passport_1.default.initialize());
        // 如果要使用 login session 時需設定
        this.app.use(passport_1.default.session());
    }
    routerSetup() {
        for (const route of router_1.router) {
            this.app.use(route.getPrefix(), route.getRouter());
        }
    }
    dbSetup() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield typeorm_1.createConnection(ormconfig_1.default);
                console.log("Has connected to DB? ", connection.isConnected);
            }
            catch (error) {
                console.log("TypeORM connection error: ", error);
            }
        });
    }
}
exports.App = App;
exports.app = new App().app;
// app.setup()
//# sourceMappingURL=app.js.map