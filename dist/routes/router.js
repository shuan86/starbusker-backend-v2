"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const member_routes_1 = require("./member.routes");
const busker_routes_1 = require("./busker.routes");
const system_routes_1 = require("./system.routes");
exports.router = [
    new member_routes_1.MemberRoutes(),
    new system_routes_1.SystemRoutes(),
    new busker_routes_1.BuskerRoutes()
];
//# sourceMappingURL=router.js.map