import { catchAsyncError } from "@s7abab/common";
import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";
import userRepository from "../repositories/enrollment.repository";


export const getEnrolledCourses = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id }: { id: string } = req.body;
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
