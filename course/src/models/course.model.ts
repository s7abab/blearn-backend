import mongoose, { Schema } from "mongoose";
import { ICourse, ILesson, IReview } from "../@types/modelTypes/course";

const reviewSchema = new Schema<IReview>({
  user: Object,
  rating: { type: Number, default: 0 },
  comment: String,
});

const lessonSchema = new Schema<ILesson>({
  type: { type: String },
  title:{type:String},
  url: { type: String },
  duration: { type: Number },
});

const courseSchema: Schema<ICourse> = new Schema<ICourse>(
  {
    instructorId: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: Schema.ObjectId, ref: "Category", required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    demoUrl: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    tags: { type: String },
    enrolls: [{ type: Schema.Types.ObjectId, ref: "User" }],
    revenue: { type: Number, default: 0 },
    isBlock: { type: Boolean, required: true, default: false },
    level: { type: Number, default: "0" },
    coupon: [{ type: Schema.Types.ObjectId }],
    reviews: [reviewSchema],
    lessons: [lessonSchema],
  },
  {
    timestamps: true,
  }
);

const courseModel = mongoose.model<ICourse>("Course", courseSchema);

export default courseModel;
