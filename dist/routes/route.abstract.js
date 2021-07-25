"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class MainRoute {
    constructor() {
        this.path = '/api';
        this.router = express_1.Router();
    }
    getPrefix() {
        return this.path;
    }
    getRouter() {
        return this.router;
    }
}
exports.default = MainRoute;
//# sourceMappingURL=route.abstract.js.map