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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuskerRoutes = void 0;
const route_abstract_1 = __importDefault(require("./route.abstract"));
const buskerController = __importStar(require("../controllers/buskerController"));
const auth_1 = require("../middlewares/auth");
const router_1 = require("../config/router");
class BuskerRoutes extends route_abstract_1.default {
    // private buskerController: BuskerController = new BuskerController();
    constructor() {
        super();
        this.setRoutes();
    }
    setRoutes() {
        // this.router.get('/test', (req: Request, res: Response) => {
        //   res.status(200).send('you called user path test!')
        // }); 
        this.router.route(router_1.apiPath.getBusker)
            .get(auth_1.authMember, buskerController.getBusker);
        this.router.route(router_1.apiPath.enrollBusker)
            .post(auth_1.authMember, buskerController.enroll);
        this.router.route(router_1.apiPath.performance)
            .post(auth_1.authMember, buskerController.applyPerformance);
        this.router.route(router_1.apiPath.performances)
            .get(buskerController.getPerformances);
        this.router.route(router_1.apiPath.performancesTime)
            .get(buskerController.getAllPerformanceTime);
    }
}
exports.BuskerRoutes = BuskerRoutes;
//# sourceMappingURL=busker.routes.js.map