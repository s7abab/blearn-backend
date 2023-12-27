import express, { Request, Response, NextFunction } from "express";
import FeedbackRepository from "../../repositories/feedback.repository";
import FeedbackUsecase from "../../usecases/feedback.usecase";
import FeedbackController from "../../controllers/feedback.controller";
import { Roles, authorizeRoles, isAuthenticated } from "@s7abab/common";

const feedbackRepository = new FeedbackRepository();
const feedbackUsecase = new FeedbackUsecase(feedbackRepository);
const feedbackController = new FeedbackController(feedbackUsecase);

const router = express.Router();

router.post(
  "/create-feedback",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    feedbackController.createFeedback(req, res, next)
);

router.get(
  "/get-feedbacks/:courseId",
  (req: Request, res: Response, next: NextFunction) =>
    feedbackController.getFeedbacks(req, res, next)
);

export default router;
