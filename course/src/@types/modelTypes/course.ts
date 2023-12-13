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
}

export interface IReview extends Document {
  user: string;
  rating: number;
  comment: string;
}

export interface ILesson extends Document {
  type: string;
  title: string;
  url: string;
  lessonNo: number;
  progress: number;
  duration?: number;
}

export interface IModule extends Document {
  title: string;
  lessons: ILesson[];
}

export interface IModuleRequest extends IModule {
  courseId: string;
}

export interface IEnrolledUser {
  userId: string;
  progress: number;
}

export interface ICourse extends Document {
  _id?: Types.ObjectId;
  instructorId?: string;
  title: string;
  category: Types.ObjectId;
  description: string;
  thumbnail: string;
  demoUrl: string;
  price: number;
  discountPrice: number;
  courseData?: Types.ObjectId[];
  enrolls?: Types.ObjectId[];
  revenue?: number;
  isBlock: boolean;
  reviews?: IReview[];
  modules?: IModule[];
  duration: number;
  totalLessons: number;
  enrolledUsers: [IEnrolledUser];
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
