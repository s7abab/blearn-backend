import { Roles } from "@s7abab/common";
import IUser from "../../entities/User";
import IUserRepository from "../../usecases/interfaces/repository/user.repository";
import userModel, { IUserSchema } from "../models/user.model";

class UserRepository implements IUserRepository {
  constructor() {}

  async create(data: IUser): Promise<IUser | null> {
    try {
      const user = await userModel.create(data);
      return user;
    } catch (error) {
      throw error;
    }
  }
  async findByRole(role: string): Promise<IUser[] | null> {
    try {
      const users = await userModel.find({ role });
      return users;
    } catch (error) {
      throw error;
    }
  }

  async findById(userId: string): Promise<IUser | null> {
    try {
      const user = await userModel.findById(userId);
      return user;
    } catch (error: any) {
      throw error;
    }
  }

  async findByIdAndRole(userId: string, role: string): Promise<IUser | null> {
    try {
      const user = await userModel.findOne({ _id: userId, role });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await userModel.findOne({ email });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByIdAndBlock(userId: string): Promise<IUser | null> {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      user.isBlock = !user.isBlock;
      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByEmailAndComparePassword(email: string, password: string) {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordMatched = await user.comparePassword(password);
    return isPasswordMatched;
  }

  async findByIdAndUpdate(
    userId: string,
    data: { name?: string; email?: string }
  ): Promise<IUser | null> {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      if (data.email) {
        const isEmailExist = await userModel.findOne({ email: data.email });
        if (!isEmailExist) {
          throw new Error("Email does not exist");
        }
        user.email = data.email;
      }

      if (data.name) {
        user.name = data.name;
      }

      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByIdAndMakeInstructor(data: any) {
    try {
      const user = await userModel.findById(data.userId);
      if (user) {
        if (user.additional_info[0]) {
          throw new Error("Additional data already added");
        }
        user.additional_info.push(data);
        user.role = Roles.INSTRUCTOR;
        await user?.save();
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findByIdAndUpdateAvatar(userId: string, imageUrl: string) {
    try {
      const user = await userModel.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }
      user.avatar = imageUrl;

      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }
}
export default UserRepository;
