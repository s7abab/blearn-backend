import { IUser } from "../../@types/modelTypes/course";
import userRepository from "../../repositories/user.repository";

export const createUser = async (payload: IUser) => {
  try {
    const { _id, name, email, role } = payload;
    const existingUser = await userRepository.findUserById(_id);
    if (existingUser) {
      throw new Error("Userr already exist");
    }

    const user = await userRepository.createUser({
      _id,
      name,
      email,
      role,
    } as IUser);

    return user;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const updateUser = async (payload: IUser) => {
  try {
    const { _id, name, email, role } = payload;
    const user = await userRepository.updateUser({
      _id,
      name,
      email,
      role,
    } as IUser);
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
};
