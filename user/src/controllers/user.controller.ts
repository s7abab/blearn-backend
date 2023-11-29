require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { sendToken } from "../utils/jwt";
import {
  IActivationRequest,
  IActivationToken,
  ILoginRequest,
  IRegisterUser,
  ISocialAuthBody,
  IUpdatePassword,
  IUpdateProfilePicture,
  IUpdateUser,
} from "../@types/types";
import { sendMessage } from "../events/publishers/publisher";
import { QueueTypes } from "../events/queues";
import { catchAsyncError } from "@s7abab/common";
import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";
import userRepository from "../repositories/user.repository";

// register user
export const registerUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password }: IRegisterUser = req.body;

      const isEmailExist = await userRepository.findUserByEmail(email);
      if (isEmailExist) {
        return next(new ErrorHandler("Email is already exist", 400));
      }
      const user: IRegisterUser = {
        name,
        email,
        password,
      };
      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;
      console.log(activationCode);

      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );

      try {
        await sendMail({
          email: user.email,
          subject: "Account Activation",
          template: "activation-mail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account.`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return new ErrorHandler(error.message, 400);
    }
  }
);

// create activation token
export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "2m",
    }
  );
  return { token, activationCode };
};

// activate user
export const activateUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const { name, email, password } = newUser.user;

      const existingUser = await userRepository.findUserByEmail(email);

      if (existingUser) {
        return next(new ErrorHandler("User already exist", 400));
      }

      const user: IUser = await userRepository.createUser({
        name,
        email,
        password,
      } as IUser);

      sendMessage(user, QueueTypes.user_queue);

      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// login user
export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;
      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }
      const user = await userRepository.findUserByEmail(email);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      const isPasswordMatched = await userRepository.compareUserPassword(
        email,
        password
      );
      if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// logout user
export const logoutUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("token");
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get user info
export const getUserInfo = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const user = await userRepository.findUserById(userId);
      if (user) {
        res.status(200).json({
          success: true,
          user,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// social auth
export const socialAuth = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, avatar } = req.body as ISocialAuthBody;
      if (!name || !email || !avatar) {
        return next(new ErrorHandler("Some fields are missing", 400));
      }
      const user = await userRepository.findUserByEmail(email);
      if (!user) {
        const newUser = await userRepository.createUser({
          email,
          name,
          avatar,
        } as IUser);
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email }: IUpdateUser = req.body;
    const userId: string | undefined = req.user?.id;

    const updatedData: Partial<IUpdateUser> = {};
    if (email) {
      updatedData.email = email;
    }
    if (name) {
      updatedData.name = name;
    }

    if (!userId) {
      throw new Error("User ID not found");
    }

    const updatedUser = await userRepository.updateUserDetails(
      userId,
      updatedData
    );

    res.status(201).json({
      success: true,
      user: updatedUser,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
};

// update profile picture
export const updateProfilePicture = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { imageUrl } = req.body as IUpdateProfilePicture;
      const userId = req.user?.id;

      if (!userId) {
        return next(new ErrorHandler("User ID not found", 400));
      }

      const updatedUser = await userRepository.updateUserProfilePicture(
        userId,
        imageUrl
      );

      res.status(200).json({
        success: true,
        user: updatedUser,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
