import { Roles } from "@s7abab/common";
import userModel, { IUser } from "../models/user.model";

class UserRepository {
  constructor() {}

  async findUsersByRole(role: string) {
    try {
      const users = await userModel.find({ role });
      return users;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findUserById(userId: string, fieldsToSelect: string = "") {
    try {
      const user = await userModel.findById(userId).select(fieldsToSelect);
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findUserByIdAndRole(userId: string, role: string) {
    try {
      const user = await userModel.findOne({ _id: userId, role });
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findUserByEmail(email: string, fieldsToSelect: string = "") {
    try {
      const user: IUser = await userModel
        .findOne({ email })
        .select(fieldsToSelect);
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async toggleBlockStatus(id: string) {
    try {
      const user = await userModel.findById(id);
      if (!user) {
        throw new Error("User not found");
      }
      console.log(user);
      user.isBlock = !user.isBlock;
      await user.save();
      return user.isBlock;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async createUser(data: IUser) {
    try {
      const user = await userModel.create(data);
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async compareUserPassword(email: string, password: string) {
    try {
      const user = await this.findUserByEmail(email, "+password");

      if (!user) {
        return false;
      }
      const isPasswordMatched = await user.comparePassword(password);
      return isPasswordMatched;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async updateUserDetails(
    userId: string,
    updatedData: { name?: string; email?: string }
  ) {
    try {
      const user = await this.findUserById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      if (updatedData.email) {
        const isEmailExist = await this.findUserByEmail(updatedData.email);
        if (!isEmailExist) {
          throw new Error("Email does not exist");
        }
        user.email = updatedData.email;
      }

      if (updatedData.name) {
        user.name = updatedData.name;
      }

      await user.save();
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async updateUserProfilePicture(userId: string, imageUrl: string) {
    try {
      const user = await this.findUserById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      user.avatar = imageUrl;
      await user.save();
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findUserAndUpdateAsInstructor(data: any) {
    try {
      const user = await this.findUserById(data.userId);
      if (user) {
        if (user.additional_info[0]) {
          throw new Error("Additional data already added");
        }
        user.additional_info.push(data);
        user.role = Roles.INSTRUCTOR;
        await user?.save();
        return user;
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default new UserRepository();
