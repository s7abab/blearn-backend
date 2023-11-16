import mongoose, { Document, Schema, Types } from "mongoose";

interface ICourse extends Document {
  title: string;
  category: string;
  preview: string;
  price: string;
  entrolls: string;
  revenue: string;
  isBlock: boolean;
  level: string;
  coupon: Types.ObjectId[];
  feedback: Types.ObjectId[];
}

const courseSchema: Schema<ICourse> = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    preview: { type: String, required: true },
    price: { type: String, required: true },
    entrolls: { type: String },
    revenue: { type: String },
    isBlock: { type: Boolean, required: true, default: false },
    level: { type: String, default: "0" },
    coupon: [{ type: Schema.Types.ObjectId }],
    feedback: [{ type: Schema.Types.ObjectId }],
  },
  {
    timestamps: true,
  }
);

const courseModel = mongoose.model<ICourse>("Course", courseSchema);

export default courseModel;
