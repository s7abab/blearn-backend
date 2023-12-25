import { Server, Socket } from "socket.io";
import IMessage from "../entities/message";

class SocketIORepository {
  private io: Server;
  private users: Map<string, number>;

  constructor(io: Server) {
    this.io = io;
    this.setupSocketEvents();
    this.users = new Map();
  }

  private setupSocketEvents() {
    this.io.on("connection", (socket: Socket) => {
      console.log("A user connected", socket.id);

      socket.on("disconnect", () => {
        console.log("A user disconnected");
        // Clean up user-related data or perform necessary actions
      });

      socket.on("joinRoom", (roomId: string, userId: string) =>
        this.handleJoinRoom(socket, roomId)
      );
      socket.on("leaveRoom", (roomId: string) =>
        this.handleLeaveRoom(socket, roomId)
      );
      socket.on("chatMessage", (roomId: string, message: IMessage) =>
        this.handleChatMessage(socket, roomId, message)
      );
    });
  }

  private handleJoinRoom(socket: Socket, roomId: string) {
    const userCount = this.users.get(roomId) || 0;
    this.users.set(roomId, userCount + 1);
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
  }

  private handleLeaveRoom(socket: Socket, roomId: string) {
    const userCount = this.users.get(roomId) || 0;
    this.users.set(roomId, userCount - 1);
    socket.leave(roomId);
    console.log(`User left room ${roomId}`);
    // Optionally, emit a message to the user confirming the room leave
    // socket.emit('roomLeft', `Left room ${roomId}`);
  }

  private handleChatMessage(socket: Socket, roomId: string, message: IMessage) {
    this.io.to(roomId).emit("message", message);
    // Optionally, handle and broadcast different message types (images, documents, etc.)
  }
}

export default SocketIORepository;
