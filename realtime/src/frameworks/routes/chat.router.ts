import express, { Request, Response, NextFunction } from "express";
import ChatRepository from "../../repositories/chat.repository";
import ChatUsecase from "../../usecases/chat.usecase";
import ChatController from "../../controllers/chat.controller";

const router = express.Router();

const chatRepository = new ChatRepository();
const chatUsecase = new ChatUsecase(chatRepository);
const chatController = new ChatController(chatUsecase);

export default router;
