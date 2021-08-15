"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuskerRoutes = void 0;
const route_abstract_1 = __importDefault(require("./route.abstract"));
// import * as buskerController from "../controllers/buskerController";
const buskerController_1 = require("../controllers/buskerController");
const router_1 = require("../config/router");
class BuskerRoutes extends route_abstract_1.default {
    constructor() {
        super();
        this.buskerController = new buskerController_1.BuskerController();
        this.setRoutes();
    }
    setRoutes() {
        // this.router.get('/test', (req: Request, res: Response) => {
        //   res.status(200).send('you called user path test!')
        // });
        this.router.route(router_1.apiPath.applyBusker)
            .post(this.buskerController.enroll);
    }
}
exports.BuskerRoutes = BuskerRoutes;
//# sourceMappingURL=busker.routes.js.map