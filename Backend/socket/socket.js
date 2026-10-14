
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export const usersocketmap = {};

export const getReceiversocketId = (receiverId) => {
  return usersocketmap[String(receiverId)];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    usersocketmap[String(userId)] = socket.id;
  }

  io.emit("onlineusers", Object.keys(usersocketmap));

  socket.on("disconnect", () => {
    if (
      userId &&
      usersocketmap[String(userId)] === socket.id
    ) {
      delete usersocketmap[String(userId)];
    }

    io.emit("onlineusers", Object.keys(usersocketmap));

  });
});

export { app, server, io };
