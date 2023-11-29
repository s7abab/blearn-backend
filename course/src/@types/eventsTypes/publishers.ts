import { Types } from "mongoose";

export interface ICreateCourseEvent extends Document {
  subject: string;
  _id: Types.ObjectId;
  title: string;
  price: number;
  isBlock: boolean;
}
