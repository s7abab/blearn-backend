import express, { NextFunction, Request, Response } from "express";
import { Roles, authorizeRoles, isAuthenticated } from "@s7abab/common";
import UserController from "../../controllers/user.controller";
import UserRepository from "../../repositories/user.repository";
import JwtService from "../utils/jwt";
import UserUsecase from "../../usecases/user.usecase";
import EventPublisher from "../rabbitmq/publisher";

const jwt = new JwtService();
// main
const eventPublisher = new EventPublisher();
const userRepository = new UserRepository();
const userUsecase = new UserUsecase(userRepository, jwt, eventPublisher);
const userController = new UserController(userUsecase);

const router = express.Router();

router.post("/register", (req: Request, res: Response, next: NextFunction) =>
  userController.registerUser(req, res, next)
);

router.post(
  "/activate-user",
  (req: Request, res: Response, next: NextFunction) => {
    userController.activateUser(req, res, next);
  }
);

router.post("/login", (req: Request, res: Response, next: NextFunction) =>
  userController.loginUser(req, res, next)
);

router.get("/logout", (req: Request, res: Response, next: NextFunction) =>
  userController.logoutUser(req, res, next)
);

router.get(
  "/current-user",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    userController.getUserInfo(req, res, next)
);

router.post("/social-auth", (req: Request, res: Response, next: NextFunction) =>
  userController.socialAuth(req, res, next)
);

router.put(
  "/update-user",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    userController.updateUser(req, res, next)
);

router.put(
  "/update-user-avatar",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    userController.updateProfilePicture(req, res, next)
);

router.post(
  "/instructor-application",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    userController.instructorApplication(req, res, next)
);

// admin
router.get(
  "/users",
  isAuthenticated,
  authorizeRoles(Roles.ADMIN),
  (req: Request, res: Response, next: NextFunction) =>
    userController.getUsers(req, res, next)
);

router.get(
  "/instructors",
  isAuthenticated,
  authorizeRoles(Roles.ADMIN),
  (req: Request, res: Response, next: NextFunction) =>
    userController.getInstructors(req, res, next)
);

router.get(
  "/single-user/:id",
  isAuthenticated,
  authorizeRoles(Roles.ADMIN),
  (req: Request, res: Response, next: NextFunction) =>
    userController.getSingleUser(req, res, next)
);

router.get(
  "/single-instructor/:id",
  isAuthenticated,
  authorizeRoles(Roles.ADMIN),
  (req: Request, res: Response, next: NextFunction) =>
    userController.getSingleInstructor(req, res, next)
);

router.put(
  "/block-user/:id",
  isAuthenticated,
  authorizeRoles(Roles.ADMIN),
  (req: Request, res: Response, next: NextFunction) =>
    userController.blockUser(req, res, next)
);

router.put(
  "/update-bankdetails",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  (req: Request, res: Response, next: NextFunction) =>
    userController.updateBankDetails(req,res,next)
);

export default router;
