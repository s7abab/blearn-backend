import { Document, Schema, Model, model, Types } from "mongoose";
import MessageType from "../../enums/messageType.enum";

// Interface for the Message schema
export interface IMessageSchema extends Document {
  senderId: Types.ObjectId;
  messageType: "text" | "image";
  content?: string;
  fileUrl?: string;
  timestamp: Date;
  chatRoomId: Types.ObjectId;
}

// Mongoose schema for messages
export const messageSchema: Schema<IMessageSchema> = new Schema({
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
  chatRoomId: {
    type: Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const messageModel = model<IMessageSchema>("Message", messageSchema);

export default messageModel;
