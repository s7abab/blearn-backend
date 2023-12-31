import mongoose, { Schema } from "mongoose";
import { IReview } from "../../interfaces/review.interface";
import { IModule } from "../../interfaces/module.interface";
import { ILesson } from "../../interfaces/lesson.interface";
import { IEnrolledUser } from "../../interfaces/enrollment.interface";
import Course from "../../entities/course";

const reviewSchema = new Schema<IReview>({
  user: String,
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
  createdAt: { type: Date, default: Date.now },
});

const enrolledUserSchema = new Schema<IEnrolledUser>({
  userId: { type: String },
  progress: { type: Number, default: 0 },
  completedLessons: { type: [String], default: [] },
});

const courseSchema: Schema<Course> = new Schema<Course>(
  {
    instructorId: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: Schema.ObjectId, ref: "Category", required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    demoUrl: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    revenue: { type: Number, default: 0 },
    isBlock: { type: Boolean, required: true, default: false },
    modules: { type: [moduleSchema], default: [] },
    totalLessons: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    enrolledUsers: { type: [enrolledUserSchema], default: [] },
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const courseModel = mongoose.model<Course>("Course", courseSchema);

export default courseModel;
