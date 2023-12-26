import { Request, Response, NextFunction } from "express";
import MessageUsecase from "../usecases/message.usecase";
import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";

class MessageController {
  private messageUsecase: MessageUsecase;
  constructor(messageUsecase: MessageUsecase) {
    this.messageUsecase = messageUsecase;
  }

  public async createMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { data } = req.body;
      await this.messageUsecase.createMessage(data);

      res.status(201).json({
        succuess: true,
        message: "message send successfuly",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatRoomId } = req.params;
      const messages = await this.messageUsecase.getMessagesByChatRoomId(
        chatRoomId
      );
      res.status(200).json({
        succuess: true,
        messages,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
}

export default MessageController;
