import { addUser, removeUser, getUser, getUsersInRoom } from "./users";

export default io => {
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
};
