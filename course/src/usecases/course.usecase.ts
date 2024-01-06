require("dotenv").config();
import CourseRepository from "../repositories/course.repository";
import Course from "../entities/course";
import {
  IModule,
  IModuleDeleteRequest,
  IModuleRequest,
} from "../interfaces/module.interface";
import {
  ILessonDelete,
  ILessonGetRequest,
  ILessonProgressTrackData,
  ILessonRequest,
} from "../interfaces/lesson.interface";
import { IEnroll } from "../interfaces/enrollment.interface";

class CourseUsecase {
  private courseRepository: CourseRepository;
  constructor(
    courseRepository: CourseRepository,
  ) {
    this.courseRepository = courseRepository;
  }

  // course
  public async createCourse(data: Course) {
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

  public async updateCourse(data: Course) {
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

  public async getCourses() {
    try {
      const courses = await this.courseRepository.findCourses();

      return courses;
    } catch (error) {
      throw error;
    }
  }

  public async searchCourses(filters: ICourseFilters) {
    try {
      const courses = await this.courseRepository.searchCourses(filters);
      return courses;
    } catch (error) {
      throw error;
    }
  }

  public async getOneCourse(courseId: string) {
    try {
      const course = await this.courseRepository.findByCourseId(courseId);
      return course;
    } catch (error) {
      throw error;
    }
  }

  public async deleteCourse(courseId: string) {
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
  public async getCoursesForInstructor(instructorId: string) {
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
  public async getOneCourseForInstructor(
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
  public async createModule(data: IModule) {
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

  public async getModules(courseId: string) {
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

  public async updateModule(data: IModuleRequest) {
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

  public async deleteModule(data: IModuleDeleteRequest) {
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

  public async createLesson(data: ILessonRequest) {
    try {
      const duration = Math.round(data.duration);
      const lesson = await this.courseRepository.createLesson({
        ...data,
        duration,
      });

      if (!lesson) {
        throw new Error("Lesson not created");
      }
      return lesson;
    } catch (error) {
      throw error;
    }
  }
  // update lesson
  public async updateLesson(data: ILessonRequest) {
    try {
      const duration = Math.round(data.duration);
      const lesson = await this.courseRepository.findLessonsAndUpdate({
        ...data,
        duration,
      });
      if (!lesson) {
        throw new Error("Lesson not updated");
      }
      return lesson;
    } catch (error) {
      throw error;
    }
  }
  // delete lesson
  public async deleteLesson(data: ILessonDelete) {
    try {
      const lesson = await this.courseRepository.findLessonAndDelete(data);
      return lesson;
    } catch (error) {
      throw error;
    }
  }

  public async getLessonsForInstructor(data: ILessonGetRequest) {
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
  public async enrollCourse(data: IEnroll) {
    try {
      const enrolledCourse = await this.courseRepository.createEnroll(data);
      if (!enrolledCourse) {
        throw new Error("Course not enrolled");
      }

      return enrolledCourse;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async getEnrolledCoursesForUser(userId: string, page: number) {
    try {
      const courses = await this.courseRepository.findEnrolledCoursesByUserId(
        userId,
        page
      );
      return courses;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async getOneEnrolledCourseForUser(userId: string, courseId: string) {
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

  public async updateProgresson(data: ILessonProgressTrackData) {
    try {
      const trackLesson =
        await this.courseRepository.findLessonAndTrackProgression(data);
      if (!trackLesson) {
        throw new Error("An error occured while tracking progression");
      }
      return trackLesson;
    } catch (error) {
      throw error;
    }
  }

  public async getProgression(userId: string, courseId: string) {
    try {
      const progression =
        await this.courseRepository.findProgressionByUserIdAndCourseId(
          userId,
          courseId
        );
      if (!progression) {
        throw new Error("An error occured while fetching progression");
      }
      return progression;
    } catch (error) {
      throw error;
    }
  }

  // get course data for dashboard
  public async getCourseData(instructorId: string) {
    try {
      const courseData = await this.courseRepository.createCourseData(
        instructorId
      );
      return courseData;
    } catch (error) {
      throw error;
    }
  }
}

export default CourseUsecase;
