import mongoose, { Types } from "mongoose";
import { IUser } from "../@types/modelTypes/course";
import userModel from "../models/user.model";
import courseModel from "../models/course.model";

class UserRepository {
  constructor() {}

  async createUser({ _id, name, email, role }: IUser) {
    try {
      const user = await userModel.create({
        _id,
        name,
        email,
        role,
      });
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findUserById(_id: Types.ObjectId) {
    try {
      const user = await userModel.findById(_id);
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async updateUser({ _id, name, email, role }: IUser) {
    try {
      const existingUser = await this.findUserById(_id);
      if (!existingUser) {
        throw new Error("User not found");
      }
      existingUser.name = name;
      existingUser.email = email;
      existingUser.role = role;

      const user = await existingUser.save();
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async addCourseToUser(userId: string, courseId: string) {
    const courseid = new mongoose.Types.ObjectId(courseId);
    const userid = new mongoose.Types.ObjectId(userId);
    try {
      const user = await this.findUserById(userid);
      if (!user) {
        throw new Error("User not found");
      }
      // push courseId to user
      const addCourse = user.courses.push(courseid);

      // increment entroll +1
      const updatedCourse = await courseModel.findByIdAndUpdate(
        courseId,
        { $inc: { entrolls: 1 } },
        { new: true }
      );
      await user.save();
      return addCourse;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findEntrolledCoursesByuserId(userId: string) {
    try {
      const user = await userModel.findById(userId).populate("courses").exec();
      const courses = user?.courses
      return courses;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default new UserRepository();
