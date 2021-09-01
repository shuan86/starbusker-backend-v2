import { app, sessionMiddleware } from "./app";
import { Server, Socket } from "socket.io";
import sharedsession from "express-socket.io-session";
import { isBuskerIdExist } from "./repositories/buskerRepo";
import { getMemberAvatarByAccount } from "./repositories/memberRepo";

const PORT = 8081;
let server = app.listen(PORT, () => {
  console.log('Express server listening on Port ', PORT);
})
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true
  }
});
io.use(sharedsession(sessionMiddleware, {
  autoSave: true
}));
io.use((socket: any, next) => {
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
}
type JoinMsgFromServerType = {
  account: string
  data: string
  avatar: string
}
type SendMsgFromServerType = {
  account: string
  data: string
}
type GetMemberAvatarType = {
  account: string
  avatar: string
}
io.on('connection', (socket: Socket) => {
  //經過連線後在 console 中印出訊息
  console.log('success connect !')
  socket.on('disconnecting', async () => {
    console.log('disconnecting rooms:', socket.rooms, 'leave:', socket['room']); // the Set contains at least the socket ID
    await socket.leave(socket['room'])//socket['id']
    delete socket['room'];
    delete socket['account'];
    console.log("a user go out");
  });
  socket.on(socketEvent.disconnect, async () => {
  });
  //監聽透過 connection 傳進來的事件
  socket.on(socketEvent.sendMsgFromClient, (msg: string) => {
    //回傳 message 給發送訊息的 Client
    console.log("sendMsg:", msg);
    console.log('account:', socket['account']);

    // socket.broadcast.to(socket['room']).emit(socketEvent.sendMsgFromServer, msg)
    io.to(socket['room']).emit(socketEvent.sendMsgFromServer, msg)

  })
  socket.on(socketEvent.joinMsg, async (msg: string) => {
    const { id, account } = JSON.parse(msg)
    const isExist = await isBuskerIdExist(id)
    if (isExist) {
      const nowRoom = Object.keys(socket.rooms).find(room => {
        return room !== socket.id
      })
      //有的話要先離開
      if (nowRoom) {
        socket.leave(nowRoom)
      }
      const room = `room${id}`
      await socket.join(room);//id
      socket['room'] = room;
      socket['account'] = account;
      const newClientAvatar = await getMemberAvatarByAccount(socket['account'])
      const data: JoinMsgFromServerType = {
        account,
        data: 'has joined this room.',
        avatar: newClientAvatar
      }
      // io.to(socket['room']).emit(socketEvent.joinMsg, JSON.stringify(data))
      const clients = io.sockets.adapter.rooms.get(socket['room'])
      // return all Socket instances in the "room1" room of the main namespace
      const sockets = await io.in(id).fetchSockets();
      const avatarsData: GetMemberAvatarType[] = [];
      for (const clientId of clients) {
        const clientSocket = io.sockets.sockets.get(clientId);
        const avatar = await getMemberAvatarByAccount(clientSocket['account'])
        avatarsData.push({ account: clientSocket['account'], avatar: avatar })
      }
      // socket.to(socket['room']).emit(socketEvent.getAllClientsAvatar, JSON.stringify(avatarsData));
      socket.to(socket['room']).emit(socketEvent.joinMsg, JSON.stringify(data))
      socket.emit(socketEvent.getAllClientsAvatar, JSON.stringify(avatarsData));

      console.log('rooms:', socket.rooms, 'join:', room, ' socket[room]:', socket['room'], 'join clients:', clients, 'avatarsData:', avatarsData.length);

    }

  });
})
// function jsonToMap(jsonStr) {
//   return new Map(JSON.parse(jsonStr));
// }
export default server