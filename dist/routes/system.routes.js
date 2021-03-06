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
exports.SystemRoutes = void 0;
const route_abstract_1 = __importDefault(require("./route.abstract"));
const systemController = __importStar(require("../controllers/systemController"));
class SystemRoutes extends route_abstract_1.default {
    // private memberController: MemberController = new MemberController();
    constructor() {
        super();
        this.setRoutes();
    }
    setRoutes() {
        // this.router.get('/test', (req: Request, res: Response) => {
        //   res.status(200).send('you called user path test!')
        // });
        this.router.route('/init')
            .get(systemController.init);
        this.router.route('/testLineOrder')
            .get(systemController.lineOrder);
        this.router.route('/testLineReceipt')
            .get(systemController.lineReceipt);
    }
}
exports.SystemRoutes = SystemRoutes;
//# sourceMappingURL=system.routes.js.map