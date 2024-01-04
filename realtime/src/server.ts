require("dotenv").config();
import { app } from "./frameworks/config/app";
import connectDb from "./frameworks/config/db";
import http from "http";
import SocketIORepository from "../src/repositories/socket.repository";
import { startListening } from "./frameworks/rabbitmq/middleware";

const server = http.createServer(app);

new SocketIORepository(server); // Initialize Socket.IO
startListening();

// create server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running ${process.env.PORT}`);
});

