import { Document, Schema, model, Types } from "mongoose";

interface IMember {
  userId: Types.ObjectId;
  isAdmin: boolean;
  isCreator: boolean;
}
// Interface for the ChatRoom schema
interface IChatRoomSchema extends Document {
  name: string;
  description: string;
  courseId: string;
  members: IMember[];
}

// Mongoose schema for chat rooms
const chatRoomSchema: Schema<IChatRoomSchema> = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  courseId: { type: String, required: true },
  members: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      isAdmin: {
        type: Boolean,
        default: false,
      },
      isCreator: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const chatRoomModel = model<IChatRoomSchema>("ChatRoom", chatRoomSchema);

export default chatRoomModel;
