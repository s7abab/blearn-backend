import express, { Request, Response, NextFunction } from "express";
import ChatRepository from "../../repositories/chatRoom.repository";
import ChatUsecase from "../../usecases/chatRoom.usecase";
import ChatController from "../../controllers/chatRoom.controller";
import { Roles, authorizeRoles, isAuthenticated } from "@s7abab/common";

const router = express.Router();

const chatRepository = new ChatRepository();
const chatUsecase = new ChatUsecase(chatRepository);
const chatController = new ChatController(chatUsecase);

router.post(
  "/create-chatroom",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  (req: Request, res: Response, next: NextFunction) =>
    chatController.createChatRoom(req, res, next)
);

router.get(
  "/get-chatrooms-for-instructor",
  isAuthenticated,
  authorizeRoles(Roles.INSTRUCTOR),
  (req: Request, res: Response, next: NextFunction) =>
    chatController.getChatRoomsForInstructor(req, res, next)
);

router.get(
  "/get-chatroom/:chatRoomId",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    chatController.getChatRoom(req, res, next)
);

router.get(
  "/get-chatroom-by-courseid/:courseId",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    chatController.getChatRoomByCourseId(req, res, next)
);

export default router;
