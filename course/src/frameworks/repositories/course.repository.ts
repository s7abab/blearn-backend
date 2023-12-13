import { ICourseRequestData } from "../../@types/course.types";
import {
  ICourse,
  IModule,
  IModuleRequest,
} from "../../@types/modelTypes/course";
import ICourseRepository from "../../usecases/interfaces/repository/course.repository";
import courseModel from "../models/course.model";

class CourseRepository implements ICourseRepository {
  constructor() {}

  async create(data: ICourse): Promise<ICourse> {
    try {
      const course = await courseModel.create(data);
      return course;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findByCourseIdAndUpdate(
    data: ICourseRequestData
  ): Promise<ICourse | null> {
    try {
      const { _id, ...updateData } = data;
      const course = await courseModel.findByIdAndUpdate(_id, updateData, {
        new: true,
      });
      return course;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async find(): Promise<ICourse[]> {
    try {
      const courses = await courseModel.find();
      return courses;
    } catch (error: any) {
      throw new Error(error);
    }
  }
  async findByCourseId(courseId: string): Promise<ICourse | null> {
    try {
      const course = await courseModel.findById(courseId);
      return course;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findByCourseIdAndDelete(courseId: string): Promise<ICourse | null> {
    try {
      const course = await courseModel.findByIdAndDelete(courseId);
      return course;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findByInstructorId(instructorId: string): Promise<ICourse[] | null> {
    try {
      const courses = await courseModel.find({
        instructorId: instructorId,
      });
      return courses;
    } catch (error) {
      throw error;
    }
  }

  async findByInstructorIdAndCourseId(
    instructorId: string,
    courseId: any
  ): Promise<ICourse | null> {
    try {
      const course = await courseModel.findOne({
        _id: courseId,
        instructorId: instructorId,
      });
      return course;
    } catch (error) {
      throw error;
    }
  }

  async findEnrolledCoursesByUserId(userId: string): Promise<ICourse[] | null> {
    try {
      const enrolledCourses = await courseModel.find({
        "enrolledUsers.userId": userId,
      });
      return enrolledCourses;
    } catch (error) {
      throw error;
    }
  }

  async findEnrolledCourseByUserAndCourseId(userId: string, courseId: string) {
    try {
      // Find the enrolled course for the specific user and course
      const enrolledCourse = await courseModel.findOne({
        _id: courseId,
        "enrolledUsers.userId": userId,
      });

      return enrolledCourse;
    } catch (error) {
      throw error;
    }
  }

  async createModule(data: IModuleRequest) {
    try {
      const course = await this.findByCourseId(data.courseId);
      if (!course) {
        throw new Error("Course not found");
      }
      const module = course?.modules?.push(data);
      await course.save();

      return module;
    } catch (error) {
      throw error;
    }
  }
}

export default CourseRepository;
