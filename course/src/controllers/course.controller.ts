import { catchAsyncError } from "@s7abab/common";
import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import {
  ICourseRequestData,
  ILessonGetRequest,
  ILessonRequest,
  IModuleDeleteRequest,
  IModuleEditRequest,
} from "../@types/course.types";
import { ICourse, IModule, IModuleRequest } from "../@types/modelTypes/course";
import courseRepository from "../repositories/course.repository";
import { getVideoDurationInSeconds } from "get-video-duration";
import courseModel from "../models/course.model";
import userRepository from "../repositories/user.repository";

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

export const editCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      _id,
      title,
      description,
      category,
      thumbnail,
      demoUrl,
      price,
      discountPrice,
    } = req.body as ICourseRequestData;
    try {
      const course = await courseRepository.findCourseAndUpdate(req.body);
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
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
    const { courseId } = req.params;
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
    const { courseId, type, title, url, index } = req.body as ILessonRequest;
    try {
      if (!type || !title || !url) {
        return next(new ErrorHandler("Please fill all fields", 400));
      }
      let duration = 60;
      if (type === "video") {
        await getVideoDurationInSeconds(url).then((d) => {
          duration = Math.round(d);
        });
      }

      await courseRepository.createLesson({
        courseId,
        type,
        title,
        url,
        duration,
        index,
      } as ILessonRequest);

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

export const addModule = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId, title } = req.body as IModuleRequest;
    try {
      const module = await courseRepository.createModule({
        courseId,
        title,
      } as IModuleRequest);

      if (!module) {
        return next(new ErrorHandler("Something went wrong", 400));
      }

      res.status(201).json({
        success: true,
        module,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
);

export const editModule = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const instructorId = req?.user?.id;
    const { courseId, title, index } = req.body;
    try {
      const module = await courseRepository.findModuleAndUpdate({
        instructorId,
        courseId,
        title,
        index,
      } as IModuleEditRequest);

      res.status(200).json({
        success: true,
        module,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
);
export const deleteModule = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const instructorId = req?.user?.id;
    const { courseId, index } = req.body;
    try {
      const module = await courseRepository.findModuleAndDelete({
        instructorId,
        courseId,
        index,
      } as IModuleDeleteRequest);

      res.status(200).json({
        success: true,
        module,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
);

export const getModules = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId } = req.params;
    try {
      if (!courseId) {
        return next(new ErrorHandler("CourseId is missing", 400));
      }

      const modules = await courseRepository.findModules(courseId);
      res.status(200).json({
        success: true,
        modules,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
);

export const getEntrolledCourses = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id;
      const courses = await courseRepository.findEntrolledCoursesByuserId(
        userId
      );
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

export const getSingleEntrolledCourse = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;
      const userId = req?.user?.id;
      const course = await courseRepository.findCourseByUserIdAndCourseId(
        userId,
        courseId
      );
      if (!course) {
        return next(new ErrorHandler("Courses not found", 404));
      }
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
);
