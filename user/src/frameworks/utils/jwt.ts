import { Secret } from "jsonwebtoken";
import jwt from "jsonwebtoken";

import {
  IActivationRequest,
  IRegisterUser,
} from "../../interfaces/user.interface";
import { redis } from "../config/redis";
import IUser from "../../entities/User";

class JwtService {
  constructor() {}

  async createToken(
    user: IUser
  ): Promise<{ token: string; expires: Date; user: IUser }> {
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET as Secret,
      {
        expiresIn: "3d",
      }
    );

    // store user details in redis
    const userString = JSON.stringify(user); // Convert the object to a string
    // Set refresh token in Redis with an expiration time
    redis.set(user._id.toString(), userString, "EX", 3 * 24 * 60 * 60); // Expires in 3 days

    const oneHourInMillis = 7 * 24 * 60 * 60 * 1000; // 1 hour in milliseconds
    const expirationDate = new Date(Date.now() + oneHourInMillis);
    return { token, expires: expirationDate, user };
  }

  async createActivationCode(
    user: IRegisterUser,
    activationCode: string
  ): Promise<{ token: string }> {
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
    return { token };
  }

  async verifyActivationCode(
    data: IActivationRequest
  ): Promise<{ user: IUser; activationCode: string }> {
    const user = jwt.verify(
      data.activation_token,
      process.env.ACTIVATION_SECRET as string
    );
    return user as { user: IUser; activationCode: string };
  }
}

export default JwtService;
