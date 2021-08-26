import { app, sessionMiddleware } from "./app";
import { Server } from "socket.io";
import sharedsession from "express-socket.io-session";

const PORT = 8081;
let server = app.listen(PORT, () => {
  console.log('Express server listening on Port ', PORT);
})
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000","http://127.0.0.1:3000"],
    credentials:true
  }
});
io.use(sharedsession(sessionMiddleware, {
  autoSave:true
})); 
io.use((socket:any, next) => {
  if( socket.handshake.session.passport){
    console.log(socket.handshake.session.passport.user);
    next();
  }
  else{
    console.log('socket.io:you are blocked');
  }
});
io.on('connection', (socket:any) => {
  //經過連線後在 console 中印出訊息
  console.log('success connect !:')
 
  
  socket.on("disconnect", () => {
    console.log("a user go out");
  });
  //監聽透過 connection 傳進來的事件
  socket.on('sendMsg', message => {
    //回傳 message 給發送訊息的 Client
    console.log("sendMsg:",message);
    socket.broadcast.emit('allMsg', message)
  })
})
export default server