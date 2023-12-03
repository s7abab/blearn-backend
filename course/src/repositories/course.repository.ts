import { ICourse } from "../@types/modelTypes/course";
import courseModel from "../models/course.model";

class CourseRepository {
  constructor() {}

  async createCourse(data: ICourse) {
    try {
      const course = await courseModel.create(
        data,
      );
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

  async findCourseByIdAndDelete(courseId:string){
    try {
        const course = await courseModel.findByIdAndDelete(courseId);
        return course
    } catch (error:any) {
        throw new Error(error)
    }
  }
}

export default new CourseRepository();
