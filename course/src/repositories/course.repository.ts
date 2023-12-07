import mongoose, { ObjectId } from "mongoose";
import {
  ICourse,
  ILesson,
  IModule,
  IModuleRequest,
} from "../@types/modelTypes/course";
import courseModel from "../models/course.model";
import { ILessonRequest } from "../@types/course.types";

class CourseRepository {
  constructor() {}

  async createCourse(data: ICourse) {
    try {
      const course = await courseModel.create(data);
      return course;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findCourses() {
    try {
      const courses = await courseModel.find();
      return courses;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findCourseById(courseId: string) {
    try {
      const course = await courseModel.findById(courseId);
      return course;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findCourseByIdAndDelete(courseId: string) {
    try {
      const course = await courseModel.findByIdAndDelete(courseId);
      return course;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findCoursesByInstructorId(instructorId: string) {
    try {
      const courses = await courseModel.find({ instructorId: instructorId });
      return courses;
    } catch (error: any) {
      throw new Error(error);
    }
  }
  async findCoursesByInstructorIdAndCourseId(
    instructorId: string,
    courseId: any
  ) {
    try {
      const course = await courseModel.findOne({
        _id: courseId,
        instructorId: instructorId,
      });
      return course;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async createLesson(data: ILessonRequest) {
    try {
      const course = await this.findCourseById(data.courseId);
      if (!course) {
        throw new Error("Course not found");
      }
      if (course.modules) {
        const lesson = course?.modules[data.index].lessons.push({
          title: data.title,
          duration: data.duration,
          type: data.type,
        } as ILesson);
        course.duration += data.duration!;
        await course.save();
        return lesson;
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findLessonsByinstructorId(instructorId: string) {
    try {
      const lessons = await courseModel.find({ instructorId });
      return lessons;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async createModule(data: IModuleRequest) {
    try {
      const course = await this.findCourseById(data.courseId);
      if (!course) {
        throw new Error("Course not found");
      }
      const module = course?.modules?.push(data);
      await course.save();
      return module;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getModules(courseId: string) {
    try {
      const course = await courseModel.findById(courseId);
      const modules = course?.modules;
      console.log(modules);
      return modules;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default new CourseRepository();
