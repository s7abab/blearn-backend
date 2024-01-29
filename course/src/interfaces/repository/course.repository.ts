import ICourse from "../../entities/course";
import { IEnroll } from "../enrollment.interface";
import { ILessonDelete, ILessonProgressTrackData, ILessonRequest } from "../lesson.interface";
import { IModule, IModuleDeleteRequest, IModuleRequest } from "../module.interface";


interface ICourseFilters {
  searchKeyword?: string;
  priceFilter?: "low" | "high";
  sortByEnrollments?: boolean;
  page: number;
}

interface ICourseRepository {
  create(data: ICourse): Promise<ICourse | null>;
  findByCourseIdAndUpdate(data: ICourse): Promise<ICourse | null>;
  findCourses(): Promise<ICourse[]>;
  searchCourses(filters: ICourseFilters): Promise<{ courses: ICourse[]; totalPages: number }>;
  findByCourseId(courseId: string): Promise<ICourse | null>;
  findByCourseIdAndDelete(courseId: string): Promise<ICourse | null>;
  findByInstructorId(instructorId: string): Promise<ICourse[] | null>;
  findByInstructorIdAndCourseId(instructorId: string, courseId: string): Promise<ICourse | null>;
  findEnrolledCoursesByUserId(userId: string, page: number, limit?: number): Promise<{ courses: ICourse[]; totalPages: number } | null>;
  findEnrolledCourseByUserAndCourseId(userId: string, courseId: string): Promise<ICourse | null>;

  createModule(data: IModule): Promise<any>;
  findModules(courseId: string): Promise<any>;
  findModuleAndUpdate(data: IModuleRequest): Promise<any>;
  findModuleAndDelete(data: IModuleDeleteRequest): Promise<any>;

  createLesson(data: ILessonRequest): Promise<any>;
  findLessonsAndUpdate(data: ILessonRequest): Promise<any>;
  findLessonAndDelete(data: ILessonDelete): Promise<any>;

  createEnroll(data: IEnroll): Promise<any>;
  findLessonAndTrackProgression(data: ILessonProgressTrackData): Promise<any>;
  findProgressionByUserIdAndCourseId(userId: string, courseId: string): Promise<number | null>;

  createCourseData(instructorId: string): Promise<any>;
}

export default ICourseRepository;
