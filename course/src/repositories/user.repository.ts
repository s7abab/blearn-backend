import { Types } from "mongoose";
import { IUser } from "../@types/modelTypes/course";
import userModel from "../models/user.model";

class UserRepository {
  constructor() {}

  async createUser({ _id, name, email, role }: IUser) {
    try {
      const user = await userModel.create({
        _id,
        name,
        email,
        role,
      });
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async findUserById(_id: Types.ObjectId) {
    try {
      const user = await userModel.findById(_id);
      return user;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async updateUser({ _id, name, email, role }: IUser) {
    try {
      const existingUser = await this.findUserById(_id);
      if (!existingUser) {
        throw new Error("User not found");
      }
      existingUser.name = name;
      existingUser.email = email;
      existingUser.role = role;

      const user = await existingUser.save();
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default new UserRepository();
