import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";
import userModel from "../../models/user.model";
import { IUser } from "../../@types/modelTypes/course";

export const createUser = async (payload: IUser) => {
  try {
    const { _id, name, email } = payload;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      throw new Error("Userr already exist");
    }
    const user = await userModel.create({
      _id,
      name,
      email,
    });

    return user;
  } catch (error: any) {
    console.log(error)
  }
};

export const updateUser = async (payload: IUser) => {
  try {
    const { _id, name, email, role } = payload;
    // Check if the user exists
    const existingUser = await userModel.findById(_id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    existingUser.name = name;
    existingUser.email = email;
    existingUser.role = role;

    const updatedUser = await existingUser.save();

    return updatedUser;
  } catch (error: any) {
    console.log(error)
  }
};
