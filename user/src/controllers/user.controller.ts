import { Request, Response, NextFunction } from "express";
import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";
import { IUpdateUser } from "../interfaces/user.interface";
import IUserUsecase from "../interfaces/usecase/user.usecase";

class UserController {
  private userUsecase: IUserUsecase;
  constructor(userUsecase: IUserUsecase) {
    this.userUsecase = userUsecase;
  }

  public async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const token = await this.userUsecase.register(req.body);

      res.status(200).json({
        success: true,
        activationToken: token,
        message: "Otp successfully sent to your email address.",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async activateUser(req: Request, res: Response, next: NextFunction) {
    try {
      await this.userUsecase.activateUser(req.body);

      res.status(201).json({
        success: true,
        message: "Account activated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userUsecase.login(req.body);

      res.cookie("token", user.token, {
        expires: user.expires,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.status(200).json({
        success: true,
        token: user.token,
        user: user.user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async logoutUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.body;
      await this.userUsecase.logout(userId);

      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async getUserInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const user = await this.userUsecase.getOneUser(userId);

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async socialAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userUsecase.socialAuth(req.body);

      res.cookie("token", user.token, {
        expires: user.expires,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.status(200).json({
        success: true,
        token: user.token,
        user: user.user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email } = req.body;
      const userId = req.user?.id;

      const updatedData: Partial<IUpdateUser> = {};
      if (email) {
        updatedData.email = email;
      }
      if (name) {
        updatedData.name = name;
      }
      const updatedUser = await this.userUsecase.updateUserDetails(
        userId,
        updatedData
      );

      res.status(201).json({
        success: true,
        user: updatedUser,
        message: "User data updated",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async updateProfilePicture(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { imageUrl } = req.body;
      const userId = req.user?.id;

      const updatedUser = await this.userUsecase.updateUserProfilePicture(
        userId,
        imageUrl
      );

      res.status(200).json({
        success: true,
        user: updatedUser,
        message: "Profile picture updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async instructorApplication(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req?.user?.id;
      const instructor = await this.userUsecase.findUserAndUpdateAsInstructor({
        ...req.body,
        userId,
      });

      res.status(200).json({
        success: true,
        instructor,
        message: "Application sent successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  // admin
  public async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userUsecase.getUsersByRole("user");

      res.status(200).send({
        success: true,
        users,
      });
    } catch (error: any) {
      return new ErrorHandler(error.message, 500);
    }
  }

  public async getInstructors(req: Request, res: Response, next: NextFunction) {
    try {
      const instructors = await this.userUsecase.getUsersByRole("instructor");

      res.status(200).send({
        success: true,
        instructors,
      });
    } catch (error: any) {
      return new ErrorHandler(error.message, 500);
    }
  }

  public async getSingleUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const user = await this.userUsecase.getUserByIdAndRole(id, "user");

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return new ErrorHandler(error.message, 500);
    }
  }

  public async getSingleInstructor(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    try {
      const user = await this.userUsecase.getUserByIdAndRole(id, "instructor");

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return new ErrorHandler(error.message, 500);
    }
  }

  public async blockUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const blockStatus = await this.userUsecase.toggleBlockStatus(id);
      let message = "";
      if (blockStatus) {
        message = "User blocked";
      } else {
        message = "User unblocked";
      }
      res.status(200).json({
        success: true,
        message,
      });
    } catch (error: any) {
      return new ErrorHandler(error.message, 500);
    }
  }

  public async updateBankDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = req.body;

      const userId = req.user?.id;
      await this.userUsecase.updateBankDetails(userId, data);

      res.status(200).json({
        success: true,
        message: "Bank details updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async getApplications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const applications = await this.userUsecase.getApplications();
      res.status(200).json({
        success: true,
        applications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async getApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const application = await this.userUsecase.getApplication(userId);
      res.status(200).json({
        success: true,
        application,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async changeStatusOfAppications(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, status } = req.body;
      await this.userUsecase.changeApplicationStatus(userId, status);

      res.status(200).send({
        success: true,
        message: "Application status changed",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  public async getUsersDataForAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await this.userUsecase.getUsersDataForAdmin();

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
}

export default UserController;
