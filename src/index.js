import "dotenv/config";
import express from "express";
import socketio from "socket.io";
import http from "http";
import cors from "cors";
import router from "./routes/router";
import auth from "./routes/auth";
import bodyParser from "body-parser";

import { addUser, removeUser, getUser, getUsersInRoom } from "./users";
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.json());
app.use(cors());
app.use(router);
app.use("/auth", auth);

io.on("connection", socket => {
  console.log("we have a new connection");

  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.emit("message", {
      user: "admin",
      text: `${user.name} Welcome to the room ${user.room}`,
    });

    socket.broadcast.emit("message", {
      user: "admin",
      text: `${user.name} has joined ${user.room}`,
    });

    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    if (!user) {
      return;
    }
    io.to(user.room).emit("message", {
      user: user.name,
      text: message,
    });
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });

  socket.on("disconnect", () => {
    console.log("user Left");
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left`,
      });
    }
  });
});

server.listen(PORT, () => {
  console.log("server is running on ", PORT);
});