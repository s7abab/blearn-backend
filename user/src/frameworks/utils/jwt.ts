import { Secret } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import IUser from "../../entities/user";
import {
  IActivationRequest,
  IRegisterUser,
} from "../../interfaces/user.interface";
import { redis } from "../config/redis";

class JwtService {
  constructor() {}

  // Method to create both access and refresh tokens and set them in Redis
  public async createToken(user: IUser) {
    try {
      // Create access token
      const accessToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET as Secret,
        { expiresIn: "1m" }
      );
      // Create refresh token
      const refreshToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.REFRESH_TOKEN_SECRET as Secret,
        { expiresIn: "3d" }
      );
      const userWithRefreshToken = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        refreshToken,
      };
      // Convert the object to a string
      const userWithRefreshTokenString = JSON.stringify(userWithRefreshToken);
      // Set refresh token in Redis with an expiration time
      redis.set(
        user._id.toString(),
        userWithRefreshTokenString,
        "EX",
        3 * 24 * 60 * 60
      ); // Expires in 3 days
      const oneHourInMillis = 24 * 60 * 60 * 1000; // 1 hour in milliseconds
      const expirationDate = new Date(Date.now() + oneHourInMillis);
      return { token: accessToken, expirationDate, user, refreshToken };
    } catch (error) {
      console.log(error);
      throw error;
    }
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
