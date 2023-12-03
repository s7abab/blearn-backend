import { catchAsyncError } from "@s7abab/common";
import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";
import userRepository from "../repositories/user.repository";

export const getEntrolledCourses = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const courses = await userRepository.findEntrolledCoursesByuserId(userId);
      if (!courses) {
        return next(new ErrorHandler("Courses not found", 404));
      }
      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
);
