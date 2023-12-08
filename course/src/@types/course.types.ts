import { Types } from "mongoose";
import { ILesson } from "./modelTypes/course";

export interface ICourseRequestData {
  _id?: string;
  title: string;
  category: string | Types.ObjectId;
  demoUrl: string;
  description: string;
  thumbnail: string;
  preview: string;
  price: number;
  discountPrice: number;
  duration: number;
}

export enum LessonType {
  VIDEO = "video",
  DOC = "document",
}

export interface ILessonRequest extends ILesson {
  courseId: string;
  index: number;
}

export interface ILessonGetRequest {
  courseId: string;
  instructorId: string;
  index: any;
}

export interface IModuleDeleteRequest {
  courseId: string;
  instructorId: string;
  index: number;
}
export interface IModuleEditRequest extends IModuleDeleteRequest {
  title: string;
}
