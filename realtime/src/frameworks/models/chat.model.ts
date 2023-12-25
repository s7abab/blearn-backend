import { Document, Schema, Model, model, Types, ObjectId } from "mongoose";
import MessageType from "../../enums/messageType.enum";

// Interface for the Message schema
interface IMessageSchema extends Document {
  senderId: Types.ObjectId;
  messageType: "text" | "image";
  content?: string;
  fileUrl?: string;
  timestamp: Date;
}

// Interface for the ChatRoom schema
interface IChatRoomSchema extends Document {
  name: string;
  admins: Types.ObjectId[];
  members: Types.ObjectId[];
  messages: IMessageSchema[];
}

// Mongoose schema for messages
const messageSchema: Schema<IMessageSchema> = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  messageType: {
    type: String,
    enum: [MessageType.TEXT, MessageType.IMAGE],
    required: true,
    default: "text",
  },
  content: {
    type: String,
  },
  fileUrl: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Mongoose schema for chat rooms
const chatRoomSchema: Schema<IChatRoomSchema> = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  admins: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [messageSchema],
});

// modeles
const ChatRoom: Model<IChatRoomSchema> = model<IChatRoomSchema>(
  "ChatRoom",
  chatRoomSchema
);
const Message: Model<IMessageSchema> = model<IMessageSchema>(
  "Message",
  messageSchema
);

export { ChatRoom, Message, IChatRoomSchema, IMessageSchema };
