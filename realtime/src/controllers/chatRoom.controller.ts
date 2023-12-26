import { NextFunction, Response, Request } from "express";
import ChatUsecase from "../usecases/chatRoom.usecase";
import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";

class ChatController {
  private chatUsecase: ChatUsecase;
  constructor(chatUsecase: ChatUsecase) {
    this.chatUsecase = chatUsecase;
  }

  public async createChatRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { data } = req.body;
      const instructorId = req?.user?.id;
      await this.chatUsecase.createChatRoom(data, instructorId);

      res.status(201).json({
        success: true,
        message: "New Community Created",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async getChatRoomsForInstructor(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const instructorId = req?.user?.id;
      const chatRooms = await this.chatUsecase.getChatRoomsForInstructor(
        instructorId
      );

      res.status(200).json({
        success: true,
        chatRooms,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async getChatRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const {chatRoomId} = req.params;
      const chatRoom = await this.chatUsecase.getChatRoom(chatRoomId);

      res.status(200).json({
        success: true,
        chatRoom,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async getChatRoomByCourseId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const chatRoom = await this.chatUsecase.getChatRoomByCourseId(courseId);

      res.status(200).json({
        success: true,
        chatRoom,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
}

export default ChatController;
