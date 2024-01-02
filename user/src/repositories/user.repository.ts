import { Roles } from "@s7abab/common";
import IUserRepository from "../interfaces/repository/user.repository";
import userModel from "../frameworks/models/user.model";
import { IBankDetails } from "../interfaces/user.interface";
import { redis } from "../frameworks/config/redis";
import IUser from "../entities/User";
import appicationStatus from "../enums/applicationStatus.enum";

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
      const cachedData = await redis.get(userId);
      if (cachedData) {
        console.log("User data fetched from Redis");
        return JSON.parse(cachedData);
      }
      const user = await userModel.findById(userId);

      // set data into redis
      await redis.set(userId, JSON.stringify(user));

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
      console.log(error);
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
      // update user information in redis
      await redis.set(userId, JSON.stringify(user));
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async findByEmailAndComparePassword(email: string, password: string) {
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        throw new Error("IUser not found");
      }
      const isPasswordMatched = await user.comparePassword(password);
      return isPasswordMatched;
    } catch (error) {
      console.log(error);
      throw error;
    }
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
      // set data into redis
      await user.save();
      await redis.set(userId, JSON.stringify(user));
      return user;
    } catch (error) {
      throw error;
    }
  }

  public async findByIdAndMakeInstructor(data: any) {
    try {
      const user = await userModel.findById(data.userId);
      if (user) {
        if (user.additional_info.length > 2) {
          throw new Error("Additional data already added");
        }
        if (user.additional_info.length > 0) {
          user.applicationStatus = appicationStatus.PENDING;
        }
        user.additional_info.push(data);
        await user?.save();
        await redis.set(user._id, JSON.stringify(user));
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
      await redis.set(userId, JSON.stringify(user));
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

  public async findApplications() {
    try {
      const applications = await userModel.find({
        applicationStatus: appicationStatus.PENDING,
      });
      return applications;
    } catch (error) {
      throw error;
    }
  }

  public async changeStatusOfApplication(userId: string, status: string) {
    try {
      let role = "";
      if (status === appicationStatus.APPROVED) {
        role = Roles.INSTRUCTOR;
      } else role = Roles.USER;

      const application = await userModel.findByIdAndUpdate(userId, {
        applicationStatus: status,
        role,
      });
      return application;
    } catch (error) {
      throw error;
    }
  }
}
export default UserRepository;
