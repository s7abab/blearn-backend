import { Server, Socket } from "socket.io";
import IMessage from "../entities/message";
import { SOCKET_EVENTS } from "../enums/socketEvents.enum";
import { Server as HttpServer } from "http";
import MessageRepository from "./message.repository";

class SocketIORepository {
  private io: Server;
  private users: Map<string, number>;
  private httpServer: HttpServer;
  private messageRepository: MessageRepository;

  constructor(httpServer: HttpServer) {
    this.httpServer = httpServer;
    this.io = new Server(httpServer, {
      cors: {
        origin: "https://blearn-azure.vercel.app",
      },
    });
    this.users = new Map();
    this.messageRepository = new MessageRepository();
    this.setupSocketEvents();
  }

  private setupSocketEvents() {
    this.io.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
      console.log("A user connected", socket.id);

      socket.on(SOCKET_EVENTS.DISCONNECT, () => {
        console.log("A user disconnected");
        // Clean up user-related data or perform necessary actions
      });

      socket.on(SOCKET_EVENTS.JOIN_ROOM, (roomId: string, userId: string) =>
        this.joinRoom(socket, roomId)
      );
      socket.on(SOCKET_EVENTS.LEAVE_ROOM, (roomId: string) =>
        this.leaveRoom(socket, roomId)
      );
      socket.on(
        SOCKET_EVENTS.CHAT_MESSAGE,
        (roomId: string, message: IMessage) =>
          this.chatMessage(socket, roomId, message)
      );
    });
  }

  private joinRoom(socket: Socket, roomId: string) {
    const userCount = this.users.get(roomId) || 0;
    this.users.set(roomId, userCount + 1);
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
  }

  private leaveRoom(socket: Socket, roomId: string) {
    const userCount = this.users.get(roomId) || 0;
    this.users.set(roomId, userCount - 1);
    socket.leave(roomId);
    console.log(`User left room ${roomId}`);
  }

  private async chatMessage(socket: Socket, roomId: string, message: IMessage) {
    console.log(message, "room", roomId);

    // save message to database
    await this.messageRepository.create(message);
    this.io.to(roomId).emit("message", message);
  }
}

export default SocketIORepository;
