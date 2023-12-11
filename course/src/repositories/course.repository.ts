import mongoose, { ObjectId } from "mongoose";
import {
  ICourse,
  ICourseProgress,
  IEnroll,
  ILesson,
  IModule,
  IModuleRequest,
} from "../@types/modelTypes/course";
import courseModel from "../models/course.model";
import {
  ICourseRequestData,
  ILessonGetRequest,
  ILessonRequest,
  IModuleDeleteRequest,
  IModuleEditRequest,
} from "../@types/course.types";
import userModel from "../models/user.model";
import userRepository from "./user.repository";

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

  async findCourseAndUpdate(data: ICourseRequestData) {
    try {
      const course = await courseModel.findByIdAndUpdate(data._id, {
        ...data,
      });
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
      const totalLessons = (course.totalLessons = course.totalLessons + 1);
      if (course.modules) {
        const lesson = course?.modules[data.index].lessons.push({
          title: data.title,
          duration: data.duration,
          type: data.type,
          url: data.url,
          lessonNo: totalLessons,
        } as ILesson);
        course.duration += data.duration!;
        await course.save();
        return lesson;
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findLessonsByinstructorId(data: ILessonGetRequest) {
    try {
      const course = await courseModel.find({
        instructorId: data.instructorId,
        _id: data.courseId,
      });
      if (course[0].modules && data.index) {
        const lesson = course[0].modules[data.index].lessons;
        return lesson;
      }
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

  async findModules(courseId: string) {
    try {
      const course = await courseModel.findById(courseId);
      const modules = course?.modules;
      return modules;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findModuleAndUpdate(data: IModuleEditRequest) {
    try {
      const course = await courseModel.findOne({
        instructorId: data.instructorId,
        _id: data.courseId,
      });
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

  async findModuleAndDelete(data: IModuleDeleteRequest) {
    try {
      const course = await courseModel.findOne({
        instructorId: data.instructorId,
        _id: data.courseId,
      });
      if (course && course.modules) {
        const courseTodelete = course.modules.splice(data.index, 1);
        await course.save();

        return courseTodelete;
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }
  async addCourseToUser({ courseId, userId }: IEnroll) {
    const courseid = new mongoose.Types.ObjectId(courseId);
    const userid = new mongoose.Types.ObjectId(userId);
    try {
      const user = await userRepository.findUserById(userid);
      if (!user) {
        throw new Error("User not found");
      }
      // push course to user
      const newCourse = {
        course: courseid,
        progress: 0,
      } as ICourseProgress;

      const addCourse = user.courses.push(newCourse);

      // increment entroll +1 and add revenue
      const course = await courseModel.findById(courseId);
      if (!course) {
        throw new Error("Course not found");
      }
      // add userId to course
      const addUserIdToCourse = course?.enrolls?.push(userid);

      const updatedCourse = await courseModel.findByIdAndUpdate(
        courseId,
        { $inc: { revenue: course?.discountPrice } },
        { new: true }
      );
      await user.save();
      await course.save();
      return addCourse;
    } catch (error: any) {
      throw new Error(error);
    }
  }
  async findEntrolledCoursesByuserId(userId: string) {
    try {
      const user = await userModel
        .findById(userId)
        .populate("courses.course")
        .exec();
      const courses = user?.courses;
      return courses;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findCourseByUserIdAndCourseId(userId: string, courseId: string) {
    try {
      const user = await userModel
        .findById(userId)
        .populate("courses.course")
        .exec();

      if (!user) {
        throw new Error("User not found");
      }

      const courses = user?.courses;

      const foundCourse = courses.find(
        (course) => course.course._id.toString() === courseId
      );

      if (!foundCourse) {
        throw new Error("Course not found for the given user");
      }

      return foundCourse.course;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default new CourseRepository();
