"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const socket_io_1 = require("socket.io");
const PORT = 8081;
let server = app_1.app.listen(PORT, () => {
    console.log('Express server listening on Port ', PORT);
});
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});
io.on('connection', socket => {
    //經過連線後在 console 中印出訊息
    // console.log('success connect !:',socket.handshake.session)
    socket.on("disconnect", () => {
        console.log("a user go out");
    });
    //監聽透過 connection 傳進來的事件
    socket.on('getMessage', message => {
        //回傳 message 給發送訊息的 Client
        socket.emit('getMessage', message);
    });
});
exports.default = server;
//# sourceMappingURL=server.js.map