import { catchAsyncError } from "@s7abab/common";
import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";
import { IEntroll } from "../@types/modelTypes/course";
import enrollmentRepository from "../repositories/enrollment.repository";
import userRepository from "../repositories/user.repository";

export const createEnrollment = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, price } = req.body as IEntroll;
      const userId = req?.user?.id;
      if (!userId || !courseId || !price) {
        return next(new ErrorHandler("Some fields are missing", 400));
      }
      const existingEnrollment =
        await userRepository.findEnrolledCourseByuserIdAndCourseId(
          userId,
          courseId
        );
      if (existingEnrollment) {
        return next(new ErrorHandler("Already entrolled course", 400));
      }
      // create new enrollment
      const newEnrollment = await enrollmentRepository.createEnrollment({
        userId,
        courseId,
        price,
      });
      // add enrolled course to user model
      await userRepository.addCourseToUser(userId, courseId);

      res.status(201).json({ success: true, message: "Enrolled successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
);

export const getEnrolledCourses = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id }: { id: string } = req.body;
      console.log(id);
      const enrollments = await userRepository.findEnrolledCoursesByUserId(id);
      res.status(200).json({
        success: true,
        enrollments,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
);
