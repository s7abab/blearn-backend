import mongoose from "mongoose";
import { ICourse, ILesson } from "../@types/modelTypes/course";
import courseModel from "../models/course.model";

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
    courseId: string
  ) {
    try {
      const course = await courseModel.findOne({
        instructorId: instructorId,
        _id: courseId,
      });
      return course;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async createLesson(data: ILesson) {
    try {
      const course = await courseModel.create({ data });
      return course;
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
}

export default new CourseRepository();
