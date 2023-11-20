import { catchAsyncError } from "@s7abab/common";
import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";
import { ICourseRequestData } from "../../@types/types";
import courseModel from "../models/course.model";
import mongoose from "mongoose";
import { ICourse } from "../../@types/modelTypes/model.types";

export const createCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      title,
      description,
      category,
      thumbnail,
      demoUrl,
      price,
      discountPrice,
    } = req.body as ICourseRequestData;
    try {
      if (
        !title ||
        !category ||
        !demoUrl ||
        !description ||
        !price ||
        !thumbnail ||
        !discountPrice
      ) {
        return next(new ErrorHandler("Fill all the fields", 400));
      }
      const course: ICourse = await courseModel.create({
        title,
        category,
        thumbnail,
        description,
        demoUrl,
        price,
        discountPrice,
      });
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getAllCourses = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await courseModel.find();
      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getSingleCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId } = req.params;
    try {
      if (!courseId) {
        return next(new ErrorHandler("Invalid courseId provided", 400));
      }

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return next(new ErrorHandler("Invalid course ID", 400));
      }

      const course = await courseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);

export const deleteCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, courseId } = req.body;
    try {
      if (!courseId) {
        return next(new ErrorHandler("Invalid courseId", 400));
      }

      await courseModel.findByIdAndDelete(courseId);

      res.status(200).json({
        success: true,
      });
    } catch (error: any) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);
