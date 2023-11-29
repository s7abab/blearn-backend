import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  role: string;
}

export interface IReview extends Document {
  user: object;
  rating: number;
  comment: string;
}

export interface ICourse extends Document {
  title: string;
  category: Types.ObjectId;
  description: string;
  thumbnail: string;
  demoUrl: string;
  price: number;
  discountPrice: number;
  courseData?: Types.ObjectId[];
  tags?: string;
  entrolls?: number;
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
