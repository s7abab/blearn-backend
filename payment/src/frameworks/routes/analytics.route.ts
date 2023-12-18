import express, { Request, Response, NextFunction } from "express";
import AnalyticsRepository from "../../repositories/analytics.repository";
import AnalyticsController from "../../controllers/analytics.controller";
import AnalyticsUsecase from "../../usecases/analytics.usecase";

const analyticsRepository = new AnalyticsRepository();
const analyticsUsecase = new AnalyticsUsecase(analyticsRepository);
const analyticsController = new AnalyticsController(analyticsUsecase);

const router = express.Router();

router.get(
  "/revenue/:courseId",
  (req: Request, res: Response, next: NextFunction) =>
    analyticsController.getAnalytics(req, res, next)
);

export default router;
