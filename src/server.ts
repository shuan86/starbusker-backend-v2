import { app } from "./app";
import { Server } from "socket.io";
const PORT = 8081;
let server = app.listen(PORT, () => {
  console.log('Express server listening on Port ', PORT);
})
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});





io.on('connection', socket => {
  //經過連線後在 console 中印出訊息
  console.log('success connect !')
  socket.on("disconnect", () => {
    console.log("a user go out");
  });
  //監聽透過 connection 傳進來的事件
  socket.on('getMessage', message => {
    //回傳 message 給發送訊息的 Client
    socket.emit('getMessage', message)
  })
})
export default server