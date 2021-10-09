"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const clientUrl = 'http://localhost:8082';
let ws;
beforeEach(() => {
    ws = socket_io_client_1.default(clientUrl);
    const initWebSocket = () => {
        //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
        ws.on('getMessage', message => {
            console.log(message);
        });
    };
    const sendMessage = () => {
        //以 emit 送訊息，並以 getMessage 為名稱送給 server 捕捉
        ws.emit('getMessage', '只回傳給發送訊息的 client');
    };
});
describe('ws test', () => {
    test('send message ', () => {
    });
});
//# sourceMappingURL=websocketClient.js.map