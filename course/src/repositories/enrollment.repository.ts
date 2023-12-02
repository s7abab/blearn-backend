import courseModel from "../models/course.model";
import userModel from "../models/user.model";

class UserRepository {
  constructor() {}
  async findUserById(userId: string) {
    try {
      const user = await userModel.findById(userId);
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async addCourseToUser(userId: string, courseId: string) {
    try {
      const user = await this.findUserById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const addCourse = user?.courses.push(courseId);
      await user.save();
      return addCourse;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findEnrolledCoursesByUserId(userId: string) {
    try {
      const user = await this.findUserById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      // Get only the course IDs enrolled by the user
      const enrolledCourseIds = user.courses.map((courseId) =>
        courseId.toString()
      );
      // Find courses with matching IDs from enrolledCourseIds array
      const enrolledCourses = await courseModel.find({
        _id: { $in: enrolledCourseIds },
      });

      return enrolledCourses;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findEnrolledCourseByuserIdAndCourseId(
    userId: string,
    courseId: string
  ) {
    try {
      const user = await this.findUserById(userId);
      const enrolledCourse = user?.courses.includes(courseId);
      return enrolledCourse;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default new UserRepository();
