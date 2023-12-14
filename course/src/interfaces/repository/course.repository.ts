import { ICourseRequestData } from "../../@types/course.types";
import { Course } from "../../entities/course";

interface ICourseRepository {
  create(data: Course): Promise<Course | null>;
  findByCourseIdAndUpdate(data: ICourseRequestData): Promise<Course | null>;
  find(): Promise<Course[]>;
  findByCourseId(courseId: string): Promise<Course | null>;
  findByCourseIdAndDelete(courseId: string): Promise<Course | null>;
  findByInstructorId(instructorId: string): Promise<Course[] | null>;
  findByInstructorIdAndCourseId(
    instructorId: string,
    courseId: any
  ): Promise<Course | null>;
  findEnrolledCoursesByUserId(userId: string): Promise<Course[] | null>;
  findEnrolledCourseByUserAndCourseId(
    userId: string,
    courseId: string
  ): Promise<Course | null>;
}

export default ICourseRepository;
