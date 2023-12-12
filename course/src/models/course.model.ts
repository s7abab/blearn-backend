import mongoose, { Schema } from "mongoose";
import {
  ICourse,
  ILesson,
  IModule,
  IReview,
} from "../@types/modelTypes/course";

const reviewSchema = new Schema<IReview>({
  user: Object,
  rating: { type: Number, default: 0 },
  comment: String,
});

const lessonSchema = new Schema<ILesson>({
  type: { type: String },
  title: { type: String },
  url: { type: String },
  lessonNo: { type: Number },
  duration: { type: Number },
  progress: { type: Number, default: 0 },
});

const moduleSchema = new Schema<IModule>({
  title: { type: String, required: true },
  lessons: { type: [lessonSchema], default: [] },
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
    enrolls: [{ type: Schema.Types.ObjectId, ref: "User" }],
    revenue: { type: Number, default: 0 },
    isBlock: { type: Boolean, required: true, default: false },
    reviews: [reviewSchema],
    modules: { type: [moduleSchema], default: [] },
    totalLessons: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    progress: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const courseModel = mongoose.model<ICourse>("Course", courseSchema);

export default courseModel;
