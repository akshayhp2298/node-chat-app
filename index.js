require('dotenv').config()
const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const router = require("./src/routes/router");
const auth = require("./src/routes/auth");
const bodyParser = require('body-parser')

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

app.use(bodyParser.json())
app.use(cors());

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

app.use(router);
app.use('/auth',auth);

server.listen(PORT, () => {
  console.log("server is running on ", PORT);
});
