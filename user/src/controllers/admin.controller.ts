import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model";
import { catchAsyncError } from "@s7abab/common";
import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";
import userRepository from "../repositories/user.repository";

export const getUsers = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userRepository.findUsersByRole("user");
      if (!users) {
        return next(new ErrorHandler("Users not found", 404));
      }
      res.status(200).send({
        success: true,
        users,
      });
    } catch (error: any) {
      return new ErrorHandler(error.message, 500);
    }
  }
);

export const getInstructors = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const instructors = await userRepository.findUsersByRole("instructor");
      if (!instructors) {
        return next(new ErrorHandler("Instructors not found", 404));
      }
      res.status(200).send({
        success: true,
        instructors,
      });
    } catch (error: any) {
      return new ErrorHandler(error.message, 500);
    }
  }
);

export const getSingleUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const user = await userRepository.findUserByIdAndRole(id, "user");
      if (!user) {
        return new ErrorHandler("User not exist", 404);
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return new ErrorHandler(error.message, 500);
    }
  }
);
export const getSingleInstructor = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const user = await userRepository.findUserByIdAndRole(id, "instructor");
      if (!user) {
        return new ErrorHandler("User not exist", 404);
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return new ErrorHandler(error.message, 500);
    }
  }
);

export const blockUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      if (!id) {
        return new ErrorHandler("Invalid id", 400);
      }
      const blockStatus = userRepository.toggleBlockStatus;
      let message = "";
      if (!blockStatus) {
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
);
