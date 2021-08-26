"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const socket_io_1 = require("socket.io");
const express_socket_io_session_1 = __importDefault(require("express-socket.io-session"));
const PORT = 8081;
let server = app_1.app.listen(PORT, () => {
    console.log('Express server listening on Port ', PORT);
});
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
        credentials: true
    }
});
io.use(express_socket_io_session_1.default(app_1.sessionMiddleware, {
    autoSave: true
}));
io.use((socket, next) => {
    if (socket.handshake.session.passport) {
        console.log(socket.handshake.session.passport.user);
        next();
    }
    else {
        console.log('socket.io:you are blocked');
    }
});
io.on('connection', (socket) => {
    //經過連線後在 console 中印出訊息
    console.log('success connect !:');
    socket.on("disconnect", () => {
        console.log("a user go out");
    });
    //監聽透過 connection 傳進來的事件
    socket.on('sendMsg', message => {
        //回傳 message 給發送訊息的 Client
        console.log("sendMsg:", message);
        socket.broadcast.emit('allMsg', message);
    });
});
exports.default = server;
//# sourceMappingURL=server.js.map