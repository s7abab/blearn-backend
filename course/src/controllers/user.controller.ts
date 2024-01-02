import { Request, Response, NextFunction } from "express";
import UserUsecase from "../usecases/user.usecase";
import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";

class UserController {
  private userUsecase: UserUsecase;
  constructor(userUsecase: UserUsecase) {
    this.userUsecase = userUsecase;
  }

  public async getEnrolledUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const users = await this.userUsecase.getEnrolledUsers(courseId);

      res.status(200).json({
        success: true,
        users,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
}

export default UserController;
