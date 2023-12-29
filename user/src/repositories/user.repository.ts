import { Roles } from "@s7abab/common";
import IUserRepository from "../interfaces/repository/user.repository";
import userModel from "../frameworks/models/user.model";
import IUser from "../entities/user";
import { IBankDetails } from "../interfaces/user.interface";
import { redis } from "../frameworks/config/redis";

class UserRepository implements IUserRepository {
  constructor() {}

  public async create(data: IUser): Promise<IUser | null> {
    try {
      const user = await userModel.create(data);
      return user;
    } catch (error) {
      throw error;
    }
  }
  public async findByRole(role: string): Promise<IUser[] | null> {
    try {
      const users = await userModel.find({ role });
      return users;
    } catch (error) {
      throw error;
    }
  }

  public async findById(userId: string): Promise<IUser | null> {
    try {
      const user = await userModel.findById(userId);
      return user;
    } catch (error: any) {
      throw error;
    }
  }

  public async findUserAndDeleteFromRedis(userId: string) {
    try {
      const deletedKeysCount = await redis.del(userId.toString());
      console.log(`Deleted ${deletedKeysCount} keys from Redis`);
      return deletedKeysCount;
    } catch (error: any) {
      console.log(error)
      throw error;
    }
  }

  public async findByIdAndRole(
    userId: string,
    role: string
  ): Promise<IUser | null> {
    try {
      const user = await userModel.findOne({ _id: userId, role });
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await userModel.findOne({ email });
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async findByIdAndBlock(userId: string): Promise<IUser | null> {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        throw new Error("IUser not found");
      }
      user.isBlock = !user.isBlock;
      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async findByEmailAndComparePassword(email: string, password: string) {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("IUser not found");
    }
    const isPasswordMatched = await user.comparePassword(password);
    return isPasswordMatched;
  }

  public async findByIdAndUpdate(
    userId: string,
    data: { name?: string; email?: string }
  ): Promise<IUser | null> {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        throw new Error("IUser not found");
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

  public async findByIdAndMakeInstructor(data: any) {
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

  public async findByIdAndUpdateAvatar(userId: string, imageUrl: string) {
    try {
      const user = await userModel.findById(userId);

      if (!user) {
        throw new Error("IUser not found");
      }
      user.avatar = imageUrl;

      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async findByIdAndUpdateBankDetails(
    userId: string,
    bankDetails: IBankDetails
  ) {
    try {
      const user = await userModel.findByIdAndUpdate(
        userId,
        { bankDetails: bankDetails },
        { new: true }
      );

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}
export default UserRepository;
