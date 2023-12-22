import { Request, Response, NextFunction } from "express";
import ExamUsecase from "../usecases/exam.usecase";
import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";
import IExam from "../entities/exam";

class ExamController {
  private examUsecase: ExamUsecase;
  constructor(examUsecase: ExamUsecase) {
    this.examUsecase = examUsecase;
  }

  public async createExam(req: Request, res: Response, next: NextFunction) {
    try {
      const data: IExam = req.body;
      await this.examUsecase.createExam(data);

      res.status(201).json({
        success: true,
        message: "Exam created successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async updateExam(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, passMark } = req.body;
      await this.examUsecase.updateExam(courseId, passMark);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async getExam(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const exam = await this.examUsecase.getExam(courseId);

      res.status(200).json({
        success: true,
        exam,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async createQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, data } = req.body;
      await this.examUsecase.createQuestion(courseId, data);

      res.status(201).json({
        success: true,
        message: "Question created successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async deleteQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, index } = req.body;
      await this.examUsecase.deleteQuestion(courseId, index);

      res.status(200).json({
        success: true,
        message: "Question deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async updateQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId, index, data } = req.body;
      console.log(req.body);
      await this.examUsecase.updateQuestion(courseId, index, data);

      res.status(200).json({
        success: true,
        message: "Question updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
}

export default ExamController;
