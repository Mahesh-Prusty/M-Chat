import http from "http";
import express from "express";
import { Server } from "socket.io";

let app = express();
let io;
const server = http.createServer(app);
io = new Server(server, {
  cors: {
    origin: "https://m-chat-m2e3.onrender.com",
  },
});

const UserSocketMap = {};
export const GetReceiverSocketID = (receiver) => {
  return UserSocketMap[receiver];
};
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userID;
  if (userId != undefined) {
    UserSocketMap[userId] = socket.id;
  }

  io.emit("GetOnlineUsers", Object.keys(UserSocketMap));
  socket.on("disconnect", () => {
    delete UserSocketMap[userId];
    io.emit("GetOnlineUsers", Object.keys(UserSocketMap));
  });
});

export { app, server };
export { io };
