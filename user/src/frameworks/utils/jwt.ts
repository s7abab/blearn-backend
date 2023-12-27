import { Secret } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import IUser from "../../entities/user";
import {
  IActivationRequest,
  IRegisterUser,
} from "../../interfaces/user.interface";

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

    const oneHourInMillis = 24 * 60 * 60 * 1000; // 1 hour in milliseconds
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