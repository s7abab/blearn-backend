import { ICourse } from "../../../@types/modelTypes/course";
import { ICourseRequestData } from "../../../@types/course.types";

interface ICourseRepository {
  create(data: ICourse): Promise<ICourse>;
  findByCourseIdAndUpdate(data: ICourseRequestData): Promise<ICourse | null>;
  find(): Promise<ICourse[]>;
  findByCourseId(courseId: string): Promise<ICourse | null>;
  findByCourseIdAndDelete(courseId: string): Promise<ICourse | null>;
  findByInstructorId(instructorId: string): Promise<ICourse[] | null>;
  findByInstructorIdAndCourseId(
    instructorId: string,
    courseId: any
  ): Promise<ICourse | null>;
  findEnrolledCoursesByUserId(userId: string): Promise<ICourse[] | null>;
  findEnrolledCourseByUserAndCourseId(
    userId: string,
    courseId: string
  ): Promise<ICourse | null>;
}

export default ICourseRepository;
