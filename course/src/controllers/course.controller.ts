import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";
import { getVideoDurationInSeconds } from "get-video-duration";
import CourseUsecase from "../usecases/course.usecase";
import { Course } from "../entities/course";
import { ILessonRequest } from "../interfaces/lesson.interface";
import { IModule } from "../interfaces/module.interface";

class CourseController {
  private courseUsecase: CourseUsecase;
  constructor(courseUsecase: CourseUsecase) {
    this.courseUsecase = courseUsecase;
  }

  async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req?.user?.id;

      const course = await this.courseUsecase.createCourse({
        instructorId: id,
        ...req.body,
      } as Course);

      res.status(200).json({
        success: true,
        message: "Course created successfully",
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  async editCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const course = await this.courseUsecase.updateCourse(req.body);

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  async getAllCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await this.courseUsecase.getCourses();

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  async getSingleCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const course = await this.courseUsecase.getOneCourse(courseId);

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  async deleteCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.body;
      await this.courseUsecase.deleteCourse(courseId);

      res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  async getCoursesForInstructors(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const instructorId = req?.user?.id;
      const courses = await this.courseUsecase.getCoursesForInstructor(
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

  async getSingleCourseForInstructors(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const instructorId = req?.user?.id;

      const course = await this.courseUsecase.getOneCourseForInstructor(
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

  async addLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, type, title, url, index } = req.body;

      let duration = 60;
      if (type === "video") {
        const videoDuration = await getVideoDurationInSeconds(url);
        duration = Math.round(videoDuration);
      }

      await this.courseUsecase.createLesson({
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

  async findLessonsForInstructor(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const instructorId = req?.user?.id;
      const lessons = await this.courseUsecase.getLessonsForInstructor(
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

  async addModule(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, title } = req.body;
      const module = await this.courseUsecase.createModule({
        courseId,
        title,
      } as IModule);

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

  async editModule(req: Request, res: Response, next: NextFunction) {
    try {
      const instructorId = req?.user?.id;
      const { courseId, title, index } = req.body;
      const module = await this.courseUsecase.updateModule({
        instructorId,
        courseId,
        title,
        index,
      });

      res.status(200).json({
        success: true,
        module,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  async deleteModule(req: Request, res: Response, next: NextFunction) {
    try {
      const instructorId = req?.user?.id;
      const { courseId, index } = req.body;
      const module = await this.courseUsecase.deleteModule({
        instructorId,
        courseId,
        index,
      });

      res.status(200).json({
        success: true,
        module,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  async getModules(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const modules = await this.courseUsecase.getModules(courseId);
      res.status(200).json({
        success: true,
        modules,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  async getEnrolledCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req?.user?.id;
      const courses = await this.courseUsecase.getEnrolledCoursesForUser(
        userId
      );

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  async getOneEnrolledCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const userId = req?.user?.id;
      const course = await this.courseUsecase.getOneEnrolledCourseForUser(
        userId,
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
}

export default CourseController;
// class over

// export const trackLesson = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const data = req.body as ILessonProgressTrackData;
//     try {
//       const course = await this.courseUsecase.findLessonAndUpdateProgresson(data);
//       res.status(200).json({
//         success: true,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, error.statusCode || 500));
//     }
//   }
// );
