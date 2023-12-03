import mongoose, { Schema, Types } from "mongoose";
import { ICourseProgress, IUser } from "../@types/modelTypes/course";

const courseProgressSchema: Schema<ICourseProgress> = new Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

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
    courses: {
      type: [courseProgressSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model<IUser>("User", userSchema);

export default userModel;
