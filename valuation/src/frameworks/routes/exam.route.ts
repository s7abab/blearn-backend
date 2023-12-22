import express, { NextFunction, Request, Response } from "express";
import ExamRepository from "../../repositories/exam.repository";
import ExamUsecase from "../../usecases/exam.usecase";
import ExamController from "../../controllers/exam.controller";
import { Roles, authorizeRoles, isAuthenticated } from "@s7abab/common";

const examRepository = new ExamRepository();
const examUsecase = new ExamUsecase(examRepository);
const examController = new ExamController(examUsecase);

const router = express.Router();

router.post(
  "/create-exam",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  (req: Request, res: Response, next: NextFunction) =>
    examController.createExam(req, res, next)
);

router.patch(
  "/update-exam",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  (req: Request, res: Response, next: NextFunction) =>
    examController.updateExam(req, res, next)
);

router.get(
  "/get-exam/:courseId",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  (req: Request, res: Response, next: NextFunction) =>
    examController.getExam(req, res, next)
);

router.post(
  "/create-question",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  (req: Request, res: Response, next: NextFunction) =>
    examController.createQuestion(req, res, next)
);

router.put(
  "/update-question",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  (req: Request, res: Response, next: NextFunction) =>
    examController.updateQuestion(req, res, next)
);

router.delete(
  "/delete-question",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  (req: Request, res: Response, next: NextFunction) =>
    examController.deleteQuestion(req, res, next)
);

export default router;
