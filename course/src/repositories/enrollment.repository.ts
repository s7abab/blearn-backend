import { IEntroll } from "../@types/modelTypes/course";
import enrollmentModel from "../models/enrollment.model";

class EnrollmentRepository {
  constructor() {}

  async findEnrollmentByUserIdAndCourseId({ userId, courseId }: IEntroll) {
    try {
      const enrollment = await enrollmentModel.findOne({
        userId,
        courseId,
      });
      return enrollment;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async createEnrollment({ userId, courseId, price }: IEntroll) {
    try {
      const enrollment = await enrollmentModel.create({
        userId,
        courseId,
        price,
      });
      return enrollment;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findEnrollmentsById(userId: string) {
    try {
      const enrollments = await enrollmentModel.findById(userId);
      return enrollments;
    } catch (error: any) {
      throw new Error(error);
    }
  }
  
  async findOneEnrollmentsById(userId: string) {
    try {
      const enrollment = await enrollmentModel.findOne({ _id: userId });
      return enrollment;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default new EnrollmentRepository();
