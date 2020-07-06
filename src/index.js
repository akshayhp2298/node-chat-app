import "dotenv/config";
import http from "http";
import app from "./app";
import io from "socket.io";
import socket from "./socket";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const socketIO = io.listen(server);
socket(socketIO);

server.listen(PORT, () => {
  console.log("server is running on ", PORT);
});

export default server;
