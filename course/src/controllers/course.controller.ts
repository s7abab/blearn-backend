import { catchAsyncError } from "@s7abab/common";
import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ICourseRequestData } from "../@types/course.types";
import { ICourse, ILesson } from "../@types/modelTypes/course";
import courseRepository from "../repositories/course.repository";

export const createCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    let {
      title,
      description,
      category,
      thumbnail,
      demoUrl,
      price,
      discountPrice,
    } = req.body as ICourseRequestData;
    const id = req?.user?.id;
    try {
      if (
        !id ||
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
      category = new mongoose.Types.ObjectId(category);
      const course = await courseRepository.createCourse({
        instructorId: id,
        title,
        category,
        thumbnail,
        description,
        demoUrl,
        price,
        discountPrice,
      } as ICourse);
      res.status(200).json({
        success: true,
        message: "Course created successfully",
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
      const courses = await courseRepository.findCourses();
      if (!courses) {
        return next(new ErrorHandler("Courses not found", 404));
      }
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

      const course = await courseRepository.findCourseById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
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
      await courseRepository.findCourseByIdAndDelete(courseId);
      res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getCoursesForInstructors = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const instructorId: string | undefined = req?.user?.id;
    try {
      if (!instructorId) {
        return next(new ErrorHandler("Instructor id missing", 400));
      }
      const courses = await courseRepository.findCoursesByInstructorId(
        instructorId
      );

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
);
export const getSingleCourseForInstructors = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId: string | undefined = req?.user?.id;
    const instructorId = req?.user?.id;
    try {
      if (!courseId) {
        return next(new ErrorHandler("CourseId id missing", 400));
      }
      const course =
        await courseRepository.findCoursesByInstructorIdAndCourseId(
          instructorId,
          courseId
        );
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
);

export const addLesson = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type, title, url, duration } = req.body as ILesson;
    try {
      if (!type || !title || !url || !duration) {
        return next(new ErrorHandler("Please fill all fields", 400));
      }
      await courseRepository.createLesson({
        type,
        title,
        url,
        duration,
      } as ILesson);

      res.status(201).json({
        success: true,
        message: "Lesson added successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
);

export const findLessonsForInstructor = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const instructorId = req?.user?.id;
    try {
      if (!instructorId) {
        return next(new ErrorHandler("Instructor id is empty", 400));
      }
      const lessons = await courseRepository.findLessonsByinstructorId(
        instructorId
      );
      res.status(200).send({
        success: true,
        lessons,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
);
