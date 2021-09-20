import { app, sessionMiddleware } from "./app";
import { Server, Socket } from "socket.io";
import sharedsession from "express-socket.io-session";
import { isPerformanceIdExist, createPerformanceComment, updateMaxChatroomOnlineAmount } from "./repositories/buskerRepo";
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
io.on('connection', (socket: any) => {
  //經過連線後在 console 中印出訊息
  socket.on('disconnecting', async () => {
    await socket.leave(socket['room'])//socket['id']
    if (io.sockets.adapter.rooms.get(socket['room']) == undefined) {//room cancel

    }
    console.log("a user go out:", socket['account']);
    delete socket['buskerId']
    delete socket['performanceId']
    delete socket['room']
    delete socket['account']
    delete socket['memberId']
    //io.sockets.adapter.rooms[room].length
  });
  socket.on(socketEvent.disconnect, async () => {
  });
  //監聽透過 connection 傳進來的事件
  socket.on(socketEvent.sendMsgFromClient, async (msg: string) => {
    //回傳 message 給發送訊息的 Client
    const { account, data } = JSON.parse(msg)//buskerId
    const isSucessfulEnroll = await createPerformanceComment({
      id: 0, buskerId: socket['buskerId'], performanceId: socket['performanceId']
      , comment: data, time: undefined, memberId: socket['memberId'], buskerPerformance: undefined, busker: undefined
      , member: undefined
    })
    if (isSucessfulEnroll)
      io.to(socket['room']).emit(socketEvent.sendMsgFromServer, msg)

  })
  socket.on(socketEvent.joinMsg, async (msg: string) => {
    const { performanceId, account } = JSON.parse(msg)//buskerId

    const isPerformanceExist = await isPerformanceIdExist(performanceId)
    if (isPerformanceExist) {
      const nowRoom = Object.keys(socket.rooms).find(room => {
        return room !== socket.id
      })
      //有的話要先離開
      if (nowRoom) {
        socket.leave(nowRoom)
      }
      const room = `room${isPerformanceExist.buskerId}`
      await socket.join(room);//id
      socket['buskerId'] = isPerformanceExist.buskerId;
      socket['performanceId'] = performanceId;
      socket['room'] = room;
      socket['account'] = account;
      socket['memberId'] = socket.handshake.session.passport.user
      const newClientAvatar = await getMemberAvatarByAccount(socket['account'])
      const data: JoinMsgFromServerType = {
        account,
        data: 'has joined this room.',
        avatar: newClientAvatar
      }
      const clients = io.sockets.adapter.rooms.get(socket['room'])
      const avatarsData: GetMemberAvatarType[] = [];
      for (const clientId of clients) {
        const clientSocket = io.sockets.sockets.get(clientId);
        const avatar = await getMemberAvatarByAccount(clientSocket['account'])
        avatarsData.push({ account: clientSocket['account'], avatar: avatar })
      }
      await updateMaxChatroomOnlineAmount(performanceId, io.sockets.adapter.rooms.get(socket['room']).size)
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