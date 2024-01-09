import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";
import { Request, Response, NextFunction } from "express";
import CourseUsecase from "../usecases/course.usecase";
import { ILessonDelete, ILessonRequest } from "../interfaces/lesson.interface";
import { IModule } from "../interfaces/module.interface";
import ICourse from "../entities/course";

class CourseController {
  private courseUsecase: CourseUsecase;
  constructor(courseUsecase: CourseUsecase) {
    this.courseUsecase = courseUsecase;
  }

  public async createCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req?.user?.id;

      const course = await this.courseUsecase.createCourse({
        instructorId: id,
        ...req.body,
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

  public async editCourse(req: Request, res: Response, next: NextFunction) {
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
  public async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const courses = await this.courseUsecase.getCourses();

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async searchCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, priceFilter, sortByEnrollments, searchKeyword } = req.query;

      const courses = await this.courseUsecase.searchCourses({
        page,
        priceFilter,
        sortByEnrollments,
        searchKeyword,
      } as any);

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }

  public async getSingleCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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

  public async deleteCourse(req: Request, res: Response, next: NextFunction) {
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

  public async getCoursesForInstructors(
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

  public async getSingleCourseForInstructors(
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

  public async addLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const lessonData = req.body;

      await this.courseUsecase.createLesson(lessonData);

      res.status(201).json({
        success: true,
        message: "Lesson added successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async updateLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as ILessonRequest;

      await this.courseUsecase.updateLesson(data);
      res.status(200).json({
        success: true,
        message: "Lesson updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  // delete lesson
  public async deleteLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as ILessonDelete;
      await this.courseUsecase.deleteLesson(data);

      res.status(200).json({
        success: true,
        message: "Lesson deleted",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
// find lessons for instructor
  public async findLessonsForInstructor(
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

  public async addModule(req: Request, res: Response, next: NextFunction) {
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

  public async editModule(req: Request, res: Response, next: NextFunction) {
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

  public async deleteModule(req: Request, res: Response, next: NextFunction) {
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

  public async getModules(req: Request, res: Response, next: NextFunction) {
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

  public async getEnrolledCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req?.user?.id;
      const { page } = req.query;
      const courses = await this.courseUsecase.getEnrolledCoursesForUser(
        userId,
        page as any
      );

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async getOneEnrolledCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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

  public async trackLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req?.user?.id;
      await this.courseUsecase.updateProgresson({
        ...req.body,
        userId,
      });
      res.status(200).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async getProgression(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const userId = req?.user?.id;
 
      const progression = await this.courseUsecase.getProgression(
        userId,
        courseId
      );
      res.status(200).json({
        success: true,
        progression,
      });
    } catch (error: any) {
      console.log(error)
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  // get course data for dashboard
  public async getCourseData(req: Request, res: Response, next: NextFunction) {
    try {
      const instructorId = req.user?.id;
      const courseData = await this.courseUsecase.getCourseData(instructorId);

      res.status(200).json({
        success: true,
        courseData,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
}

export default CourseController;
