require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/user.model";
import jwt, { Secret } from "jsonwebtoken";

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET as Secret,
    {
      expiresIn: "3d",
    }
  );

  return res.status(statusCode).json({
    success: true,
    user,
    token,
  });
};
