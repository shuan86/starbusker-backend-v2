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
    //?????????????????? console ???????????????
    socket.on('disconnecting', () => __awaiter(void 0, void 0, void 0, function* () {
        yield socket.leave(socket['room']); //socket['id']
        if (io.sockets.adapter.rooms.get(socket['room']) == undefined) { //room cancel
        }
        console.log("a user go out:", socket['account']);
        delete socket['buskerId'];
        delete socket['performanceId'];
        delete socket['room'];
        delete socket['account'];
        delete socket['memberId'];
        //io.sockets.adapter.rooms[room].length
    }));
    socket.on(socketEvent.disconnect, () => __awaiter(void 0, void 0, void 0, function* () {
    }));
    //???????????? connection ??????????????????
    socket.on(socketEvent.sendMsgFromClient, (msg) => __awaiter(void 0, void 0, void 0, function* () {
        //?????? message ?????????????????? Client
        const { account, data } = JSON.parse(msg); //buskerId
        const isSucessfulEnroll = yield buskerRepo_1.createPerformanceComment({
            id: 0, buskerId: socket['buskerId'], performanceId: socket['performanceId'],
            comment: data, time: undefined, memberId: socket['memberId'], buskerPerformance: undefined, busker: undefined,
            member: undefined
        });
        if (isSucessfulEnroll)
            io.to(socket['room']).emit(socketEvent.sendMsgFromServer, msg);
    }));
    socket.on(socketEvent.joinMsg, (msg) => __awaiter(void 0, void 0, void 0, function* () {
        const { performanceId, account } = JSON.parse(msg); //buskerId
        const isPerformanceExist = yield buskerRepo_1.isPerformanceIdExist(performanceId);
        if (isPerformanceExist) {
            const nowRoom = Object.keys(socket.rooms).find(room => {
                return room !== socket.id;
            });
            //?????????????????????
            if (nowRoom) {
                socket.leave(nowRoom);
            }
            const room = `room${isPerformanceExist.buskerId}`;
            yield socket.join(room); //id
            socket['buskerId'] = isPerformanceExist.buskerId;
            socket['performanceId'] = performanceId;
            socket['room'] = room;
            socket['account'] = account;
            socket['memberId'] = socket.handshake.session.passport.user;
            const newClientAvatar = yield memberRepo_1.getMemberAvatarByAccount(socket['account']);
            const data = {
                account,
                data: 'has joined this room.',
                avatar: newClientAvatar
            };
            const clients = io.sockets.adapter.rooms.get(socket['room']);
            const avatarsData = [];
            for (const clientId of clients) {
                const clientSocket = io.sockets.sockets.get(clientId);
                const avatar = yield memberRepo_1.getMemberAvatarByAccount(clientSocket['account']);
                avatarsData.push({ account: clientSocket['account'], avatar: avatar });
            }
            yield buskerRepo_1.updateMaxChatroomOnlineAmount(performanceId, io.sockets.adapter.rooms.get(socket['room']).size);
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