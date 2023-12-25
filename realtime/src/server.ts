require("dotenv").config();
import { app } from "./frameworks/config/app";
import connectDb from "./frameworks/config/db";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import SocketIORepository from "../src/repositories/socket.repository";

const server = http.createServer(app); // Create HTTP server
// Socket.IO setup

const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

new SocketIORepository(io); // Initialize Socket.IO
// create server
server.listen(process.env.PORT || 8004, () => {
  connectDb();
  console.log(`Server running ${process.env.PORT}`);
});
