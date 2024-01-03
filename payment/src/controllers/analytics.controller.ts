import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";
import AnalyticsUsecase from "../usecases/analytics.usecase";
import { Request, Response, NextFunction } from "express";

class AnalyticsController {
  private analyticsUsecase: AnalyticsUsecase;
  constructor(analyticsUsecase: AnalyticsUsecase) {
    this.analyticsUsecase = analyticsUsecase;
  }

  public async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const { courseId } = req.params;
      const revenue = await this.analyticsUsecase.getCourseRevenue(courseId);

      res.status(200).json({
        success: true,
        revenue,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
  // total revenue of instructor
  public async getTotalRevenueOfInstructor(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const instructorId = req?.user?.id;

      const data = await this.analyticsUsecase.getTotalRevenueOfInstructor(
        instructorId
      );

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
  // total revenue of admin
  public async getTotalRevenueOfAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await this.analyticsUsecase.getTotalRevenueOfAdmin();

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
}

export default AnalyticsController;
