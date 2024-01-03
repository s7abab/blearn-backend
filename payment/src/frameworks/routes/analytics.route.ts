import express, { Request, Response, NextFunction } from "express";
import AnalyticsRepository from "../../repositories/analytics.repository";
import AnalyticsController from "../../controllers/analytics.controller";
import AnalyticsUsecase from "../../usecases/analytics.usecase";
import { Roles, authorizeRoles, isAuthenticated } from "@s7abab/common";

const analyticsRepository = new AnalyticsRepository();
const analyticsUsecase = new AnalyticsUsecase(analyticsRepository);
const analyticsController = new AnalyticsController(analyticsUsecase);

const router = express.Router();

router.get(
  "/revenue/:courseId",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  (req: Request, res: Response, next: NextFunction) =>
    analyticsController.getAnalytics(req, res, next)
);

router.get(
  "/total-revenue-of-instructor",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  (req: Request, res: Response, next: NextFunction) =>
    analyticsController.getTotalRevenueOfInstructor(req, res, next)
);

router.get(
  "/total-revenue-of-admin",
  isAuthenticated,
  authorizeRoles(Roles.ADMIN),
  (req: Request, res: Response, next: NextFunction) =>
    analyticsController.getTotalRevenueOfAdmin(req, res, next)
);

export default router;
