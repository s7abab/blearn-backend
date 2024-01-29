import ICourse from "../../entities/course";
import { IEnroll } from "../enrollment.interface";
import {
  ILessonDelete,
  ILessonGetRequest,
  ILessonProgressTrackData,
  ILessonRequest,
} from "../lesson.interface";
import {
  IModule,
  IModuleDeleteRequest,
  IModuleRequest,
} from "../module.interface";

interface ICourseFilters {
  searchKeyword?: string;
  priceFilter?: "low" | "high";
  sortByEnrollments?: boolean;
  page: number;
}

interface ICourseUsecase {
  createCourse(data: ICourse): Promise<ICourse | null>;
  updateCourse(data: ICourse): Promise<ICourse | null>;
  getCourses(): Promise<ICourse[] | null>;
  searchCourses(
    filters: ICourseFilters
  ): Promise<{ courses: ICourse[]; totalPages: number }>;
  getOneCourse(courseId: string): Promise<ICourse | null>;
  deleteCourse(courseId: string): Promise<ICourse | null>;
  getCoursesForInstructor(instructorId: string): Promise<ICourse[] | null>;
  getOneCourseForInstructor(
    instructorId: string,
    courseId: any
  ): Promise<ICourse | null>;

  createModule(data: IModule): Promise<IModule | null>;
  getModules(courseId: string): Promise<IModule[] | null>;
  updateModule(data: IModuleRequest): Promise<any>;
  deleteModule(data: IModuleDeleteRequest): Promise<IModule | null>;

  createLesson(data: ILessonRequest): Promise<any>;
  updateLesson(data: ILessonRequest): Promise<any>;
  deleteLesson(data: ILessonDelete): Promise<any>;
  getLessonsForInstructor(data: ILessonGetRequest): Promise<any>;

  enrollCourse(data: IEnroll): Promise<any>;
  getEnrolledCoursesForUser(userId: string, page: number): Promise<any>;
  getOneEnrolledCourseForUser(userId: string, courseId: string): Promise<any>;
  updateProgresson(data: ILessonProgressTrackData): Promise<any>;
  getProgression(userId: string, courseId: string): Promise<number | null>;

  getCourseData(instructorId: string): Promise<any>;
}

export default ICourseUsecase;
