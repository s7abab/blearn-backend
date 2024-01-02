import express, { NextFunction, Request, Response } from "express";
import { Roles, authorizeRoles, isAuthenticated } from "@s7abab/common";
import UserController from "../../controllers/user.controller";
import UserUsecase from "../../usecases/user.usecase";
import UserRepository from "../../repositories/user.repository";

const userRepository = new UserRepository();
const userUsecase = new UserUsecase(userRepository);
const userController = new UserController(userUsecase);

const router = express.Router();

router.get(
  "/get-enrolled-users/:courseId",

  (req: Request, res: Response, next: NextFunction) =>
    userController.getEnrolledUsers(req, res, next)
);


export default router;