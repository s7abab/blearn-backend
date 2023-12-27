import { Request, Response, NextFunction } from "express";
import FeedbackUsecase from "../usecases/feedback.usecase";
import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";

class FeedbackController {
  private feedbackUsecase: FeedbackUsecase;
  constructor(feedbackUsecase: FeedbackUsecase) {
    this.feedbackUsecase = feedbackUsecase;
  }

  public async createFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const { data } = req.body;
      const feedback = await this.feedbackUsecase.createFeedback(data);

      res.status(201).json({
        success: true,
        message: "Feedback added",
      });
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async getFeedbacks(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const feedbacks = await this.feedbackUsecase.findFeedbacksByCourseId(
        courseId
      );

      res.status(201).json({
        success: true,
        message: "Feedback added",
        feedbacks,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
}

export default FeedbackController;
