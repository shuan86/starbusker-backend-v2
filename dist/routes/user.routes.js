"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const route_abstract_1 = __importDefault(require("./route.abstract"));
const userController_1 = __importDefault(require("../controllers/userController"));
class UserRoutes extends route_abstract_1.default {
    constructor() {
        super();
        this.userController = new userController_1.default();
        this.setRoutes();
    }
    setRoutes() {
        this.router.get('/test', (req, res) => {
            res.status(200).send('you called user path test!');
        });
        this.router.route('/user')
            .get(this.userController.getAll)
            .post(this.userController.createOne);
        this.router.route('/user/:id')
            .get(this.userController.getOne)
            .put(this.userController.updateOne)
            .delete(this.userController.deleteOne);
    }
}
exports.default = UserRoutes;
//# sourceMappingURL=user.routes.js.map