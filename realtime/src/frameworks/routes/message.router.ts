import express, { Request, Response, NextFunction } from "express";
import MessageController from "../../controllers/message.controller";
import MessageUsecase from "../../usecases/message.usecase";
import MessageRepository from "../../repositories/message.repository";
import { isAuthenticated } from "@s7abab/common";

const router = express.Router();

const messageRepository = new MessageRepository();
const messageUsecase = new MessageUsecase(messageRepository);
const messageController = new MessageController(messageUsecase);

router.post(
  "/create-message",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    messageController.createMessage(req, res, next)
);

router.get(
  "/get-messages/:chatRoomId",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    messageController.getMessages(req, res, next)
);

export default router;
