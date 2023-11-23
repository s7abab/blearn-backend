import { Types } from "mongoose";

export interface ICourseRequestData {
  title: string;
  category: string | Types.ObjectId;
  demoUrl: string;
  description: string;
  thumbnail: string;
  preview: string;
  price: number;
  discountPrice: number;
}

export interface ICreateCategory {
  name: string;
}

export interface IEditCategory {
  categoryId: string;
  name: string;
}

export interface ICategoryId {
  categoryId: string;
}
