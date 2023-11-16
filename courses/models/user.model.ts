import mongoose, { Document, Schema, Types } from "mongoose";

interface IUser extends Document {
  _id?: string;
  name: string;
  email: string;
  role: string;
}

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    _id: { type: Schema.Types.ObjectId, default: new Types.ObjectId() },
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    role: { type: String, default: "user" },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
