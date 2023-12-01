import { Types } from "mongoose";

export interface ICourseRequestData {
  id:string;
  title: string;
  category: string | Types.ObjectId;
  demoUrl: string;
  description: string;
  thumbnail: string;
  preview: string;
  price: number;
  discountPrice: number;
}
