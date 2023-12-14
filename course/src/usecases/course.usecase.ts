import CourseRepository from "../repositories/course.repository";
import Course from "../entities/course";
import {
  IModule,
  IModuleDeleteRequest,
  IModuleRequest,
} from "../interfaces/module.interface";
import {
  ILesson,
  ILessonGetRequest,
  ILessonRequest,
} from "../interfaces/lesson.interface";
import { IEnroll } from "../interfaces/enrollment.interface";

class CourseUsecase {
  private courseRepository: CourseRepository;
  constructor(courseRepository: CourseRepository) {
    this.courseRepository = courseRepository;
  }

  // course
  async createCourse(data: Course) {
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

  async updateCourse(data: Course) {
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

  async getCourses() {
    try {
      const courses = await this.courseRepository.find();
      return courses;
    } catch (error) {
      throw error;
    }
  }

  async getOneCourse(courseId: string) {
    try {
      const course = await this.courseRepository.findByCourseId(courseId);
      return course;
    } catch (error) {
      throw error;
    }
  }

  async deleteCourse(courseId: string) {
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
  async getCoursesForInstructor(instructorId: string) {
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
  ): Promise<Course | null> {
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
  async createModule(data: IModule) {
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
      const modules = await this.courseRepository.findModules(courseId);
      if (!modules) {
        throw new Error("Modules not found");
      }
      return modules;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async updateModule(data: IModuleRequest) {
    try {
      const updatedModule = await this.courseRepository.findModuleAndUpdate(
        data
      );

      if (!updatedModule) {
        throw new Error("Module not updated");
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async deleteModule(data: IModuleDeleteRequest) {
    try {
      const deleteModule = await this.courseRepository.findModuleAndDelete(
        data
      );
      if (!deleteModule) {
        throw new Error("Module not deleted");
      }
      return deleteModule;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async createLesson(data: ILessonRequest) {
    try {
      const lesson = await this.courseRepository.createLesson(data);
      if (!lesson) {
        throw new Error("Lesson not created");
      }
      return lesson;
    } catch (error) {
      throw error;
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
  async enrollCourse(data: IEnroll) {
    try {
      const enrolledCourse = await this.courseRepository.enrollCourse(data);
      if (!enrolledCourse) {
        throw new Error("Course not enrolled");
      }

      return enrolledCourse;
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
