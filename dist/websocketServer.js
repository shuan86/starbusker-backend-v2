"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.a = exports.wsServer = void 0;
const socket_io_1 = require("socket.io");
const server_1 = __importDefault(require("./server"));
const http_1 = require("http");
const WS_PORT = 8081;
exports.wsServer = http_1.createServer();
const io = new socket_io_1.Server(server_1.default, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});
io.on('connection', (socket) => {
    console.log('a user connected');
});
io.on('connection', socket => {
    //經過連線後在 console 中印出訊息
    console.log('success connect!');
    socket.on("disconnect", () => {
        console.log("a user go out");
    });
    //監聽透過 connection 傳進來的事件
    socket.on('getMessage', message => {
        //回傳 message 給發送訊息的 Client
        socket.emit('getMessage', message);
    });
});
const a = () => console.log('123');
exports.a = a;
// export default wsServer
//# sourceMappingURL=websocketServer.js.map