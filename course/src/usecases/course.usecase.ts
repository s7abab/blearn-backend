import {
  ICourse,
  IEnroll,
  ILesson,
  IModuleRequest,
} from "../@types/modelTypes/course";
import {
  ICourseRequestData,
  ILessonGetRequest,
  ILessonRequest,
  IModuleDeleteRequest,
  IModuleEditRequest,
} from "../@types/course.types";
import CourseRepository from "../frameworks/repositories/course.repository";

class CourseUsecase {
  private courseRepository: CourseRepository;
  constructor(courseRepository: CourseRepository) {
    this.courseRepository = courseRepository;
  }

  // course
  async createCourse(data: ICourse) {
    try {
      const course = await this.courseRepository.create(data);
      if (!course) {
        throw new Error("Course not created");
      }
      return course;
    } catch (error) {
      throw error;
    }
  }

  async updateCourse(data: ICourseRequestData): Promise<ICourse | null> {
    try {
      const updatedCourse = await this.courseRepository.findByCourseIdAndUpdate(
        data
      );
      if (!updatedCourse) {
        throw new Error("Course not updated");
      }
      return updatedCourse;
    } catch (error) {
      throw error;
    }
  }

  async getCourses(): Promise<ICourse[]> {
    try {
      const courses = await this.courseRepository.find();
      return courses;
    } catch (error) {
      throw error;
    }
  }

  async getOneCourse(courseId: string): Promise<ICourse | null> {
    try {
      const course = await this.courseRepository.findByCourseId(courseId);
      return course;
    } catch (error) {
      throw error;
    }
  }

  async deleteCourse(courseId: string): Promise<ICourse | null> {
    try {
      const course = await this.courseRepository.findByCourseIdAndDelete(
        courseId
      );
      return course;
    } catch (error) {
      throw error;
    }
  }
  // get all courses for instructor
  async getCoursesForInstructor(
    instructorId: string
  ): Promise<ICourse[] | null> {
    try {
      const courses = await this.courseRepository.findByInstructorId(
        instructorId
      );
      return courses;
    } catch (error) {
      throw error;
    }
  }
  // get one course for instructor
  async getOneCourseForInstructor(
    instructorId: string,
    courseId: any
  ): Promise<ICourse | null> {
    try {
      const course = await this.courseRepository.findByInstructorIdAndCourseId(
        instructorId,
        courseId
      );
      return course;
    } catch (error) {
      throw error;
    }
  }

  // Module
  async createModule(data: IModuleRequest) {
    try {
      const module = await this.courseRepository.createModule(data);
      if (!module) {
        throw new Error("Module not created");
      }
      return module;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getModules(courseId: string) {
    try {
      const course = await this.courseRepository.findByCourseId(courseId);
      const modules = course?.modules;
      return modules;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async updateModule(data: IModuleEditRequest) {
    try {
      const course = await this.courseRepository.findByInstructorIdAndCourseId(
        data.instructorId,
        data.courseId
      );
      if (course && course.modules) {
        const moduleToUpdate = course.modules[data.index];
        moduleToUpdate.title = data.title;
        await course.save();

        return moduleToUpdate;
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async deleteModule(data: IModuleDeleteRequest) {
    try {
      const course = await this.courseRepository.findByInstructorIdAndCourseId(
        data.instructorId,
        data.courseId
      );
      if (!course) {
        throw new Error("Course not found");
      }
      if (course.modules) {
        const courseTodelete = course.modules.splice(data.index, 1);
        await course.save();

        return courseTodelete;
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async createLesson(data: ILessonRequest) {
    try {
      const course = await this.courseRepository.findByCourseId(data.courseId);
      if (!course) {
        throw new Error("Course not found");
      }
      const totalLessons = (course.totalLessons = course.totalLessons + 1);
      if (course.modules) {
        const lesson = course?.modules[data.index].lessons.push({
          title: data.title,
          duration: data.duration,
          type: data.type,
          url: data.url,
          lessonNo: totalLessons,
        } as ILesson);
        if (data.type === "video") {
          course.duration += data.duration!;
        }
        await course.save();
        return lesson;
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getLessonsForInstructor(data: ILessonGetRequest) {
    try {
      const course = await this.courseRepository.findByInstructorIdAndCourseId(
        data?.instructorId,
        data?.courseId
      );
      if (!course) {
        throw new Error("Course not found");
      }
      if (course.modules && data.index) {
        const lesson = course.modules[data.index].lessons;
        return lesson;
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  // enroll
  async enrollCourse({ courseId, userId }: IEnroll) {
    try {
      const course = await this.courseRepository.findByCourseId(courseId);
      if (!course) {
        throw new Error("Course not found");
      }
      // push enrolled user data
      course.enrolledUsers.push({
        userId: userId,
        progress: 0,
      });
      await course.save();
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getEnrolledCoursesForUser(userId: string) {
    try {
      const courses = await this.courseRepository.findEnrolledCoursesByUserId(
        userId
      );
      return courses;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getOneEnrolledCourseForUser(userId: string, courseId: string) {
    try {
      const enrolledCourse =
        await this.courseRepository.findEnrolledCourseByUserAndCourseId(
          userId,
          courseId
        );
      if (!enrolledCourse) {
        throw new Error("Course not found");
      }
      return enrolledCourse;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default CourseUsecase;
