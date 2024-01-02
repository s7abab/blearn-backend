import ICourse from "../../entities/course";

interface ICourseRepository {
  create(data: ICourse): Promise<ICourse | null>;
  findCourses(): Promise<ICourse[]>;
  findByCourseIdAndUpdate(data: ICourse): Promise<ICourse | null>;
  searchCourses(
    data: ICourseFilters
  ): Promise<{ courses: ICourse[]; totalPages: number } | null>;
  findByCourseId(courseId: string): Promise<ICourse | null>;
  findByCourseIdAndDelete(courseId: string): Promise<ICourse | null>;
  findByInstructorId(instructorId: string): Promise<ICourse[] | null>;
  findByInstructorIdAndCourseId(
    instructorId: string,
    courseId: any
  ): Promise<ICourse | null>;
  findEnrolledCoursesByUserId(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<{ courses: ICourse[]; totalPages: number } | null>;
  findEnrolledCourseByUserAndCourseId(
    userId: string,
    courseId: string
  ): Promise<ICourse | null>;
}

export default ICourseRepository;
