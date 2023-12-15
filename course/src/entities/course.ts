import { IEnrolledUser } from "../interfaces/enrollment.interface";
import { IModule } from "../interfaces/module.interface";
import { IReview } from "../interfaces/review.interface";

export interface ICourse {
  _id: any;
  instructorId?: string;
  title: string;
  category: any;
  description: string;
  thumbnail: string;
  demoUrl: string;
  price: number;
  discountPrice: number;
  revenue?: number;
  isBlock: boolean;
  reviews?: IReview[];
  modules: IModule[];
  duration: number;
  totalLessons: number;
  enrolledUsers: [IEnrolledUser];
}

export default ICourse;