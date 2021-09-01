"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const socket_io_1 = require("socket.io");
const express_socket_io_session_1 = __importDefault(require("express-socket.io-session"));
const buskerRepo_1 = require("./repositories/buskerRepo");
const memberRepo_1 = require("./repositories/memberRepo");
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
        console.log('socketio member id:', socket.handshake.session.passport.user);
        next();
    }
    else {
        console.log('socket.io:you are blocked');
    }
});
const socketEvent = {
    sendMsgFromClient: 'sendMsgFromClient',
    sendMsgFromServer: 'sendMsgFromServer',
    joinMsg: 'joinMsg',
    disconnect: 'disconnect',
    getAllClientsAvatar: 'getAllClientsAvatar',
    getNewClientAvatar: 'getNewClientAvatar',
};
io.on('connection', (socket) => {
    //經過連線後在 console 中印出訊息
    console.log('success connect !');
    socket.on('disconnecting', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('disconnecting rooms:', socket.rooms, 'leave:', socket['room']); // the Set contains at least the socket ID
        yield socket.leave(socket['room']); //socket['id']
        delete socket['room'];
        delete socket['account'];
        console.log("a user go out");
    }));
    socket.on(socketEvent.disconnect, () => __awaiter(void 0, void 0, void 0, function* () {
    }));
    //監聽透過 connection 傳進來的事件
    socket.on(socketEvent.sendMsgFromClient, (msg) => {
        //回傳 message 給發送訊息的 Client
        console.log("sendMsg:", msg);
        console.log('account:', socket['account']);
        // socket.broadcast.to(socket['room']).emit(socketEvent.sendMsgFromServer, msg)
        io.to(socket['room']).emit(socketEvent.sendMsgFromServer, msg);
    });
    socket.on(socketEvent.joinMsg, (msg) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, account } = JSON.parse(msg);
        const isExist = yield buskerRepo_1.isBuskerIdExist(id);
        if (isExist) {
            const nowRoom = Object.keys(socket.rooms).find(room => {
                return room !== socket.id;
            });
            //有的話要先離開
            if (nowRoom) {
                socket.leave(nowRoom);
            }
            const room = `room${id}`;
            yield socket.join(room); //id
            socket['room'] = room;
            socket['account'] = account;
            const newClientAvatar = yield memberRepo_1.getMemberAvatarByAccount(socket['account']);
            const data = {
                account,
                data: 'has joined this room.',
                avatar: newClientAvatar
            };
            // io.to(socket['room']).emit(socketEvent.joinMsg, JSON.stringify(data))
            const clients = io.sockets.adapter.rooms.get(socket['room']);
            // return all Socket instances in the "room1" room of the main namespace
            const sockets = yield io.in(id).fetchSockets();
            const avatarsData = [];
            for (const clientId of clients) {
                const clientSocket = io.sockets.sockets.get(clientId);
                const avatar = yield memberRepo_1.getMemberAvatarByAccount(clientSocket['account']);
                avatarsData.push({ account: clientSocket['account'], avatar: avatar });
            }
            // socket.to(socket['room']).emit(socketEvent.getAllClientsAvatar, JSON.stringify(avatarsData));
            socket.to(socket['room']).emit(socketEvent.joinMsg, JSON.stringify(data));
            socket.emit(socketEvent.getAllClientsAvatar, JSON.stringify(avatarsData));
            console.log('rooms:', socket.rooms, 'join:', room, ' socket[room]:', socket['room'], 'join clients:', clients, 'avatarsData:', avatarsData.length);
        }
    }));
});
// function jsonToMap(jsonStr) {
//   return new Map(JSON.parse(jsonStr));
// }
exports.default = server;
//# sourceMappingURL=server.js.map