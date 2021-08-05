"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const PORT = 8081;
let server = app_1.app.listen(PORT, () => {
    console.log('Express server listening on Port ', PORT);
});
exports.default = server;
//# sourceMappingURL=server.js.map