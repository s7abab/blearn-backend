import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: string;
  courses: [ICourseProgress];
}

export interface ICourseProgress extends Document {
  course: mongoose.Types.ObjectId;
  progress: number;
}

export interface IReview extends Document {
  user: object;
  rating: number;
  comment: string;
}

export interface ICourse extends Document {
  instructorId?: mongoose.Types.ObjectId;
  title: string;
  category: Types.ObjectId;
  description: string;
  thumbnail: string;
  demoUrl: string;
  price: number;
  discountPrice: number;
  courseData?: Types.ObjectId[];
  tags?: string;
  enrolls?: Types.ObjectId[];
  revenue?: number;
  isBlock: boolean;
  level?: number;
  coupon?: Types.ObjectId[];
  reviews?: IReview[];
  rating?: number;
}

export interface ICategory extends Document {
  name: string;
  isListed: boolean;
}

export interface IEnroll {
  userId: string;
  courseId: string;
  price?: number;
  payment_status?: string;
}
